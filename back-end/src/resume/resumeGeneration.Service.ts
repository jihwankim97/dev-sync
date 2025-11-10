import { BadRequestException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ResumeService } from './resume.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entity/user.entity';
import { SkillModel } from './entity/skill.entity';

@Injectable()
export class ResumeGenerationService {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly configService: ConfigService,
  ) {}

  async generateResume(profileData: unknown, user: User) {
    const normalizedProfileData = this.normalizeProfileData(profileData);
    const profileDataString =
      typeof profileData === 'string'
        ? profileData
        : JSON.stringify(normalizedProfileData);

    const limitedProfileData =
      profileDataString.length > 12000
        ? profileDataString.slice(0, 12000)
        : profileDataString;

    let resumeData: any;
    try {
      resumeData = JSON.parse(
        await this.callResumeCompletion(limitedProfileData),
      );
    } catch {
      throw new BadRequestException(
        '생성된 이력서 데이터를 해석하는 데 실패했습니다.',
      );
    }

    const resume = await this.resumeService.create(
      user,
      `${user.name}의 자소서`,
    );

    await this.resumeService.saveBlock(resume.id, {
      type: 'profile',
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      education: user.educationLevel,
      githubUrl: `https://github.com/${user.githubUrl}`,
      blogUrl: user.blogUrl,
    });

    await this.resumeService.saveBlock(resume.id, {
      type: 'introduction',
      headline: resumeData.introduction.headline,
      description: resumeData.introduction.description,
    });

    const strengths = await this.resolveSkills(resumeData.skills?.strengths);

    const familiar = await this.resolveSkills(resumeData.skills?.familiar);

    await this.resumeService.saveBlock(resume.id, {
      id: 'skills',
      type: 'skills',
      strongSkillIds: strengths.map((skill) => ({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
      })),
      familiarSkillIds: familiar.map((skill) => ({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
      })),
    });

    const projects = resumeData.projects;
    await this.resumeService.saveBlock(resume.id, {
      type: 'projects',
      items: projects,
    });

    return this.resumeService.findDetail(resume.id);
  }

  private async callResumeCompletion(profileJson: string): Promise<string> {
    const prompt = `
You will receive JSON describing GitHub repositories the user selected.
Return ONLY JSON that matches the schema below.

Schema:
{
  "introduction": {
    "headline": "one-sentence headline in Korean",
    "description": "self introduction in Korean (1000-1200 characters)"
  },
  "skills": {
    "strengths": ["core technical skills"],
    "familiar": ["secondary skills"]
  },
  "projects": [
    {
      "name": "repository name",
      "description": "project summary in Korean",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string",
      "role": "role in Korean",
      "outcomes": [
        {
          "task": "short task title in Korean",
          "result": "detailed result in Korean"
        }
      ]
    }
  ]
}

Rules:
- Include every repository from the input exactly once in projects.
- Derive skills strictly from explicit technology/tool names available in the input (e.g., primary_language, languages[].language, topics, techStack) and reuse their canonical casing. Do not generate conceptual phrases such as "API 설계" or "문제 해결". If no matching technology exists, leave the array empty. Each skill must correspond to an actual technology that can appear in the Devicon dataset.
- Build outcomes primarily from selected_commits; if insufficient, use meaningful recent_commit_messages. If commit.note exists, weave it into result. Provide between 3 and 7 outcomes per project when evidence exists, never exceeding 7. Order outcomes by highest impact first and keep task/result phrasing concise.
- Results must cite concrete actions, tools, leadership decisions, or measurable impact found in the input.
- When repository.created_at is present, copy it to projects[].startDate in YYYY-MM-DD; when repository.updated_at is present, copy it to projects[].endDate in YYYY-MM-DD. Leave the field as "" if no source value exists.
- Craft introduction.headline/description to project a high-impact senior engineer: highlight ownership, architecture decisions, scale, performance improvements, and quantifiable outcomes when available. Avoid generic buzzwords.
- Do not invent facts. Leave unknown values as empty string "" or [].
- All narrative text must be Korean; keep JSON keys in English.

Input JSON:
${profileJson}
`;

    try {
      const openai: OpenAI = new OpenAI({
        apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that converts GitHub repository JSON into structured Korean resume data. Follow the provided schema strictly and never fabricate details.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1800,
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });

      const totalTokens =
        (response.usage?.prompt_tokens || 0) +
        (response.usage?.completion_tokens || 0);
      console.log(
        `Tokens used - Input: ${response.usage?.prompt_tokens || 'N/A'}, Output: ${response.usage?.completion_tokens || 'N/A'}, Total: ${totalTokens}`,
      );

      return (
        response.choices[0]?.message?.content || '자소서 생성에 실패했습니다'
      );
    } catch {
      throw new BadRequestException('자소서 생성에 실패했습니다');
    }
  }

  private normalizeProfileData(profileData: unknown): any[] {
    if (Array.isArray(profileData)) {
      return profileData;
    }

    if (typeof profileData === 'string') {
      try {
        const parsed = JSON.parse(profileData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  private async resolveSkills(skillNames: string[]): Promise<SkillModel[]> {
    if (!Array.isArray(skillNames) || skillNames.length === 0) {
      return [];
    }

    const resolved = await Promise.all(
      skillNames.map(async (skill) => {
        if (!skill) return null;
        const [match] = await this.resumeService.searchSkills(skill);
        return match ?? null;
      }),
    );

    const uniqueById = new Map<number, SkillModel>();
    resolved
      .filter((skill): skill is SkillModel => Boolean(skill))
      .forEach((skill) => {
        if (!uniqueById.has(skill.id ?? -1)) {
          uniqueById.set(skill.id, skill);
        }
      });

    return Array.from(uniqueById.values());
  }
}
