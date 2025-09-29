import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { ResumeService } from './resume.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResumeGenerationService {
  private openai: OpenAI;

  constructor(
    private readonly resumeService: ResumeService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }


  async generateResume(profileData: string, userId: number) {

    const resumeData = JSON.parse(await this.callResumeCompletion(profileData));

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const resume = await this.resumeService.createResume(
      userId,
      `${user.name}의 자소서`,
    );

    await this.resumeService.saveBlock(resume.id, {
      type: "profile",
      name: user.name,
      email: user.email,
      phoneNumber: user.phone_number,
      education: user.educationLevel,
      githubUrl: `https://github.com/${user.githubUrl}`,
      blogUrl: user.blogUrl,
    });

    await this.resumeService.saveBlock(resume.id, {
      type: "introduction",
      headline: resumeData.introduction.headline,
      description: resumeData.introduction.description,
    });

    const strengthsRaw = await Promise.all(
      resumeData.skills.strengths.map(async (skill) => {
        const [match] = await this.resumeService.searchSkills(skill);
        return match;
      }),
    );
    const strengths = strengthsRaw.filter(Boolean);

    const familiarRaw = await Promise.all(
      resumeData.skills.familiar.map(async (skill) => {
        const [match] = await this.resumeService.searchSkills(skill);
        return match;
      }),
    );
    const familiar = familiarRaw.filter(Boolean);

    await this.resumeService.saveBlock(resume.id, {
      type: "skills",
      strongSkillIds: strengths.map((s) => s.id),
      familiarSkillIds: familiar.map((s) => s.id),
    });

    const projects = resumeData.projects;

    for (const project of resumeData.projects) {
      const matchedSkillIds = (
        await Promise.all(
          (project.skills || []).map(async (skillName) => {
            const [result] = await this.resumeService.searchSkills(skillName);

            return result ? result.id : undefined;
          }),
        )
      ).filter(Boolean);

      project.skills = matchedSkillIds;
    }

    await this.resumeService.saveBlock(
      resume.id,
      {
        type: "projects",
        items: projects,
      },
    );



    return this.resumeService.getResumeDetails(resume.id);

  }

  async callResumeCompletion(profileData: string): Promise<string> {
    const prompt = `
Using the following GitHub profile data, generate a structured JSON object for a developer portfolio. 

### JSON Structure:
{
  "introduction": {
    "headline": "",// A short headline-style sentence to introduce yourself at the top of the resume. Summarize your identity as a developer in one impactful phrase (e.g., "끈기 있게 성장하는 백엔드 개발자입니다", "사용자 경험을 생각하는 프론트엔드 개발자입니다").
    "description": "" // Developer's self-introduction in Korean (400-500 characters), focusing on their experience, core skills, and career goals.
  },
  "skills": {
    "strengths": [], // List of key technical skills (e.g., React, Node.js, SQL).
    "familiar": [] // List of secondary or familiar skills (e.g., Docker, TailwindCSS).
  },
  "projects": [
    {
      "name": "", // Repository name.
      "description": "", // Brief description of the project in Korean.
      "startDate": "", // Start date of the project (if available).
      "endDate": "", // End date of the project (if available).
      "skills": [], // List of skill IDs used in the project.
      "outcomes": [
        {
          "task": "", // A short title in Korean summarizing the task or achievement (e.g., "구글 인증 구현").
          "result": "" // Detailed explanation in Korean. Describe:
          // - The specific action or task performed based on the commit message (e.g., "구글 인증 기능을 구현했습니다").
          // - The tools/technologies used, if applicable (e.g., "TypeScript와 Google API를 활용").
          // - The outcome or improvement achieved (e.g., "로그인 시간을 20% 단축하여 사용자 유지율을 높였습니다").
        }
      ],
      "role": "" // Role played in the project (e.g., "Frontend Developer", "Full-Stack Developer").
    }
  ]
}

### Guidelines:
1. Use **only the information provided in the "GitHub Profile Data" section** to populate the JSON object.
2. Do not fabricate data or add anything that is not explicitly stated in the profileData.
3. For the "outcomes" section:
   - Use each entry in "Recent Commit Details" to create an individual outcome.
   - The "title" must summarize the task or feature implemented, directly reflecting the commit message.
   - The "result" must describe the action, tools/technologies used (if applicable), and the outcome of the commit in Korean.
   - If the commit message lacks detail, infer meaning conservatively based on the commit content and the repository's general purpose.
4. Include all repositories from the profileData as individual projects in the "projects" key.
5. The "description" field for each project should summarize the repository's purpose based on its name, commit history, or description in the profileData.
6. Write all descriptive fields (e.g., introduction, outcomes) in **Korean**.
7. Keep all JSON keys (e.g., description, strengths, outcomes) in **English**.

### Important Notes:
- Do not include work or outcomes that the user did not explicitly perform or commit, as detailed in the "GitHub Profile Data".
- For missing or unclear details in the profileData, leave the fields empty or use placeholders such as "N/A".
- Ensure the portfolio strictly matches the user's contributions and skills as represented in the profileData.

GitHub Profile Data:
${profileData}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500, 
        temperature: 0.7,
      });

      // 입력 토큰과 출력 토큰을 계산하여 콘솔에 출력
      const totalTokens =
        (response.usage?.prompt_tokens || 0) +
        (response.usage?.completion_tokens || 0);
      console.log(
        `Tokens used - Input: ${response.usage?.prompt_tokens || 'N/A'}, Output: ${response.usage?.completion_tokens || 'N/A'}, Total: ${totalTokens}`,
      );

      return (
        response.choices[0]?.message?.content || '자소서 생성에 실패했습니다'
      );
    } catch (error) {
      console.error('Error generating resume:', error);
      throw new Error('자소서 생성에 실패했습니다');
    }
  }
}
