import { BadRequestException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ResumeService } from './resume.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entity/user.entity';
import { SkillModel } from './entity/skill.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ResumeModel } from './entity/resume.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ResumeGenerationService {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly configService: ConfigService,

    @InjectRepository(ResumeModel)
    private readonly resumeRepository: Repository<ResumeModel>,

    @InjectQueue('resume-generation-queue')
    private readonly resumeGenerationQueue: Queue,
  ) {}

  async generateResume(profileData: unknown, user: User) {
    const resume = await this.resumeService.create(user, `생성중인 자소서`);

    const job = await this.resumeGenerationQueue.add('create-resume', {
      profileData,
      resumeId: resume.id,
      user,
    });
    return {
      message: '자소서 생성 작업이 예약되었습니다.',
      jobId: job.id,
      resumeId: resume.id,
    };
  }

  async createResume(profileData: unknown, resumeId: string, user: User) {
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

    await this.resumeRepository.update(resumeId, {
      title: `${user.name}의 자소서`,
    });

    await this.resumeService.saveBlock(resumeId, {
      type: 'profile',
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      education: user.educationLevel,
      githubUrl: `${user.githubUrl}`,
      blogUrl: user.blogUrl,
    });

    await this.resumeService.saveBlock(resumeId, {
      type: 'introduction',
      headline: resumeData.introduction.headline,
      description: resumeData.introduction.description,
    });

    const strengths = await this.resolveSkills(resumeData.skills?.strengths);

    const familiar = await this.resolveSkills(resumeData.skills?.familiar);

    await this.resumeService.saveBlock(resumeId, {
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

    await this.resumeService.saveBlock(resumeId, {
      type: 'projects',
      items: resumeData.projects,
    });

    return this.resumeService.findDetail(resumeId);
  }

  private async callResumeCompletion(profileJson: string): Promise<string> {
    const prompt = `
You will receive JSON describing GitHub repositories the user selected.
Return ONLY JSON that matches the schema below.

Schema:
{
  "introduction": {
    "headline": "one-sentence headline in Korean (<=80 characters)",
    "description": "self introduction in Korean (380-450 characters)"
  },
  "skills": {
    "strengths": ["core technical skills"],
    "familiar": ["secondary skills"]
  },
  "projects": [
    {
      "name": "repository name (<=150 characters)",
      "description": "project summary in Korean (<=220 characters)",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string",
      "role": "role in Korean (<=150 characters)",
      "outcomes": [
        {
          "task": "short task title in Korean (<=80 characters)",
          "result": "detailed result in Korean (<=220 characters)"
        }
      ]
    }
  ]
}

Guidelines:
- Include every repository exactly once. Regardless of quality, every repository provided by the user must appear in the projects array, sorted by the most recent timeline.startDate.
- Derive skills strictly from explicit technologies (languages.primary, languages.detailed[].language, topics, metrics_summary, techStack). Use canonical casing compatible with Devicon; do not invent or include conceptual phrases.
- introduction.description must stay between 380 and 450 characters. Reference ownership, architecture decisions, scalability, and quantitative impact only when there is evidence in the input data; never fabricate details. The text itself must be in Korean.
- Projects must keep the given order (newest first) and preserve provided dates. startDate = timeline.startDate (created_at) in YYYY-MM-DD format; endDate = timeline.endDate (pushed_at) or "" when absent.
- role should reflect ownership strictly based on evidence (e.g., only label as "백엔드 리드" when ownership.is_owner is true). Otherwise, state the role without implying leadership. All role strings must remain in Korean.
- user_notes.commits/pull_requests contain user-authored notes. Treat these as the highest-priority evidence when crafting outcomes, followed by pull request data, then commit or other evidence.
- Provide 3-7 outcomes per project. Each outcome must cite concrete actions or metrics grounded in (priority order) user_notes, activity.pull_requests/body_preview, metrics_summary, highlights, recent_commits, activity.latest_release, release_summary, or evidence.commit_messages/readme_excerpt. Follow a concise "문제/상황 → 행동 → 정량적 성과" structure whenever possible, and write in a confident senior-engineer tone (in Korean).
- Avoid duplicate outcomes; prioritise the highest-impact contributions while keeping wording varied and professional.
- All narrative text (headline, description, outcomes, etc.) must be in Korean. If reliable data is unavailable, output "" or [] rather than guessing.

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
