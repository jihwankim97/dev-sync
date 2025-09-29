import { Injectable, NotFoundException } from '@nestjs/common';

import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeModel } from './entities/resume.entity';
import { ILike, In, Repository } from 'typeorm';
import { IntroductionModel } from './entities/introduction.entity';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { SkillModel } from './entities/skill.entity';
import { ProfileModel } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProjectModel } from './entities/project.entity';
import { ProjectOutcomeModel } from './entities/project-outcome.entity';
import { CreateOutcomeDto } from './dto/create-project-outcome.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectsWidthOutcomesDto } from './dto/create-projects-width-outcomes.dto';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { ConfigService } from '@nestjs/config';
import { CareerModel } from './entities/career.entity';
import { AchievementModel } from './entities/achievement.entity';
import { CreateAchievementsDto } from './dto/create-achievements.dto';
import { CreateCareersDto } from './dto/create-careers.dto';
import { CustomModel } from './entities/custom.entity';
import { CreateCustomDto } from './dto/create-custom.dto';
import { OrderModel } from './entities/order.entity';
import { UpdateBlockOrdersDto } from './dto/update-block-orders.dto';
import { ResumeBlockType } from './enum/resume-type.enum';

@Injectable()
export class ResumeService {
  // GitHub API를 통해 레포지토리 리스트 가져오기

  constructor(
    private readonly userService: UserService,
    @InjectRepository(ResumeModel)
    private readonly resumeRepository: Repository<ResumeModel>,
    @InjectRepository(IntroductionModel)
    private readonly introductionRepository: Repository<IntroductionModel>,
    @InjectRepository(SkillModel)
    private readonly skillRepository: Repository<SkillModel>,
    @InjectRepository(ProjectModel)
    private readonly projectRepository: Repository<ProjectModel>,
    @InjectRepository(ProjectOutcomeModel)
    private readonly projectOutcomeRepository: Repository<ProjectOutcomeModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    private readonly configService: ConfigService,
    @InjectRepository(CareerModel)
    private readonly careerRepository: Repository<CareerModel>,
    @InjectRepository(AchievementModel)
    private readonly achievementRepository: Repository<AchievementModel>,
    @InjectRepository(CustomModel)
    private readonly customRepository: Repository<CustomModel>,
    @InjectRepository(OrderModel)
    private readonly blockOrderRepository: Repository<OrderModel>,
  ) {}

  // GITHUB 인증 헤더 생성 함수
  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.configService.get<string>('GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github.v3+json',
    };
  }

  async getGitHubData(name: string, email: string) {
    const userinfo = [];

    const user = await this.userService.getUser(email);

    const username = user.githubUrl.split('/').pop();

    // 모든 레포지토리 가져오기
    const repositories = await this.getUserRepositories(username);

    // 레포지토리를 크기순으로 내림차순 정렬 후 최대 7개 선택
    const topRepositories = repositories
      .sort((a, b) => b.size - a.size)
      .slice(0, 7);

    // 상위 7개의 레포지토리에 대해 정보 수집
    for (const repository of topRepositories) {
      const repoInfo = {
        name: repository.name,
        description: repository.description,
        language: repository.language,
        size: repository.size,
        stargazers_count: repository.stargazers_count,
        forks_count: repository.forks_count,
        html_url: repository.html_url,
        readme_content:
          !repository.description &&
          (await this.getReadmeContent(username, repository.name)),
      };

      const additionalData = await this.getAdditionalRepositoryData(
        username,
        repository.name,
      );
      userinfo.push({ ...repoInfo, ...additionalData });
    }

    if (userinfo.length === 0) {
      throw new Error('No repositories found for the user');
    }

    return userinfo;
  }

  async getUserRepositories(username: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('GITHUB_TOKEN')}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );
      return response.data; // 레포지토리 리스트 반환
    } catch (error) {
      console.error(
        'Error fetching GitHub repositories:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch GitHub repositories');
    }
  }

  // README 파일을 가져오는 함수
  async getReadmeContent(username: string, repoName: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/contents/README.md`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('GITHUB_TOKEN')}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8',
      );

      let cleanedText = content.replace(/<\/?[^>]+(>|$)/g, '\n');

      cleanedText = cleanedText.replace(/!\[.*?\]\(.*?\)/g, '');

      cleanedText = cleanedText.replace(/\\n\s*\+/g, '');

      cleanedText = cleanedText.replace(/\s+/g, ' ');

      cleanedText = cleanedText.replace(/\n+/g, '\n');

      return cleanedText.trim();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return 'README not available';
      } else {
        console.error(
          `Error fetching README for ${repoName}:`,
          error.response?.data || error.message,
        );
        return 'Error fetching README';
      }
    }
  }

  async getAdditionalRepositoryData(username: string, repositoryName: string) {
    const pp: any = {};

    try {
      const commitMessages = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/commits`,
        {
          headers: this.getAuthHeaders(),
        },
      );

      // username에 해당하는 사용자의 커밋만 필터링
      pp.recent_commit_messages = commitMessages.data
        .filter((commit) => commit.author && commit.author.login === username) // username 필터링
        .map((commit) => {
          let message = commit.commit.message;
          message = message.replace(/\n\s*\+/g, '');
          message = message.replace(/\s+/g, ' ');
          message = message.replace(/\n+/g, '\n');
          return message.trim();
        })
        .filter((message, index, self) => {
          // 불필요한 메시지를 제거
          const ignorePattern =
            /^(merge( branch)?|update|initial commit|release|resolve|bump|create readme|fix conflicts)/i;
          if (ignorePattern.test(message)) return false;

          // 중복 메시지 제거
          return self.indexOf(message) === index;
        })
        .filter((message) => {
          // 의미 없는 커밋 메시지 제거 (너무 짧은 메시지)
          return message.length > 10;
        });

      // 기여자 정보
      const contributorsData = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/contributors`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      const userContributions = contributorsData.data.find(
        (contributor) => contributor.login === username,
      );
      pp.contributions = userContributions
        ? userContributions.contributions
        : 0;

      // 풀 리퀘스트
      const pullRequests = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/pulls`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      pp.recent_pull_requests = pullRequests.data.slice(0, 3).map((pr) => ({
        title: pr.title,
        created_at: pr.created_at,
        status: pr.state,
      }));

      // 릴리즈 정보
      const releasesData = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/releases`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      pp.latest_release =
        releasesData.data.length > 0 ? releasesData.data[0].name : 'No release';
    } catch (error) {
      console.error(
        'Error fetching repository data:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch repository data');
    }

    return pp;
  }

  //resume CRUD

  async saveBlock(resumeId: string, dto: any) {
    const { type, ...entityData } = dto;

    let result;
    let blockType: ResumeBlockType;
    let blockId: string | undefined;

    switch (type) {
      case 'introduction':
        result = await this.upsertIntroduction(resumeId, entityData);
        blockType = ResumeBlockType.INTRODUCTION;
        break;
      case 'profile':
        result = await this.upsertProfile(resumeId, entityData);
        blockType = ResumeBlockType.PROFILE;
        break;
      case 'projects':
        result = await this.syncProjectsForResume(resumeId, entityData);
        blockType = ResumeBlockType.PROJECTS;
        break;
      case 'skills':
        result = await this.setSkillsForResume(resumeId, entityData);
        blockType = ResumeBlockType.SKILLS;
        break;
      case 'careers':
        result = await this.upsertCareer(resumeId, entityData);
        blockType = ResumeBlockType.CAREERS;
        break;
      case 'achievements':
        result = await this.upsertAchievement(resumeId, entityData);
        blockType = ResumeBlockType.ACHIEVEMENTS;
        break;
      case 'custom':
        result = await this.upsertCustom(resumeId, entityData);
        blockType = ResumeBlockType.CUSTOM;
        blockId = entityData.id; // 커스텀 블록의 경우 ID가 있음
        break;
    }

    // 블록 순서에 추가 (이미 존재하는지 확인 후 추가)
    if (result) {
      await this.addBlockToOrderIfNotExists(resumeId, blockType, blockId);
    }

    return result;
  }

  getResumes(id: number): Promise<ResumeModel[]> {
    return this.resumeRepository.find({
      where: { author: { user_id: id } },
      relations: ['profile', 'str_skills', 'fam_skills'],
    });
  }

  private async getResume(id: string): Promise<ResumeModel> {
    const resume = await this.resumeRepository.findOne({
      where: { id },
    });
    if (!resume) {
      throw new NotFoundException(`Resume with ID ${id} not found.`);
    }
    return resume;
  }

  async getResumeDetails(id: string) {
    const resume = await this.resumeRepository.findOne({ where: { id } });
    if (!resume) throw new NotFoundException();

    const [
      profile,
      introduction,
      skills,
      projects,
      careers,
      achievements,
      customs,
      blockOrders,
    ] = await Promise.all([
      this.getProfile(resume.id),
      this.getIntroduction(resume.id),
      this.getSkillsByResumeId(resume.id),
      this.getProjectsByResumeId(resume.id),
      this.getCareersByResumeId(resume.id),
      this.getAchievementsByResumeId(resume.id),
      this.getCustomsByResumeId(resume.id),
      this.getBlockOrders(resume.id),
    ]);

    const entities = [];

    if (profile) {
      entities.push(profile);
    }

    if (introduction) {
      entities.push(introduction);
    }

    if (skills && skills.strengths.length > 0) {
      entities.push(skills);
    }
    if (projects && projects.items.length > 0) {
      entities.push(projects);
    }
    if (careers && careers.items.length > 0) entities.push(careers);
    if (achievements && achievements.items.length > 0)
      entities.push(achievements);

    if (customs && customs.items.length > 0) {
      customs.items.forEach((custom) => {
        entities.push({
          id: custom.id,
          type: 'custom',
          title: custom.title,
          description: custom.description,
        });
      });
    }

    return {
      id: resume.id,
      title: resume.title,
      order: blockOrders,
      entities,
    };
  }

  async createResume(userId: number, title: string): Promise<ResumeModel> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const resume = this.resumeRepository.create({
      title,
      author: user,
    });

    return this.resumeRepository.save(resume);
  }

  async removeResume(userId: number, resumeId: string): Promise<ResumeModel> {
    const resume = await this.getResume(resumeId);

    return this.resumeRepository.remove(resume);
  }

  async getIntroduction(resumeId: string) {
    const introduction = await this.introductionRepository.findOne({
      where: { resume: { id: resumeId } },
    });

    if (!introduction) {
      return null;
    }

    return { id: introduction.id, type: 'introduction', ...introduction };
  }

  async upsertIntroduction(resumeId: string, dto: CreateIntroductionDto) {
    const resume = await this.getResume(resumeId);

    let introduction = await this.introductionRepository.findOne({
      where: { resume: { id: resume.id } },
    });

    if (!introduction) {
      introduction = this.introductionRepository.create({
        resume,
      });
    }

    introduction.headline = dto.headline;
    introduction.description = dto.description;

    return this.introductionRepository.save(introduction);
  }

  async removeIntroduction(resumeId: string) {
    const resume = await this.getResume(resumeId);

    const introduction = await this.introductionRepository.findOne({
      where: { resume: { id: resume.id } },
    });

    if (!introduction) {
      throw new NotFoundException(
        `Introduction for resume ID ${resumeId} not found.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.INTRODUCTION);

    return this.introductionRepository.remove(introduction);
  }

  async getProfile(resumeId: string) {
    const profile = await this.profileRepository.findOne({
      where: { resume: { id: resumeId } },
    });

    if (!profile) {
      return null;
    }

    return { id: profile.id, type: 'profile', ...profile };
  }

  async upsertProfile(resumeId: string, profileDto: CreateProfileDto) {
    const resume = await this.getResume(resumeId);

    let profile = await this.profileRepository.findOne({
      where: { resume: { id: resume.id } },
    });

    if (!profile) {
      profile = this.profileRepository.create({
        resume,
      });
    }

    profile.name = profileDto.name;
    profile.email = profileDto.email;
    profile.phoneNumber = profileDto.phoneNumber;
    profile.githubUrl = profileDto.githubUrl;
    profile.blogUrl = profileDto.blogUrl;

    return this.profileRepository.save(profile);
  }

  async removeProfile(resumeId: string) {
    const resume = await this.getResume(resumeId);

    const profile = await this.profileRepository.findOne({
      where: { resume: { id: resume.id } },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile for resume ID ${resumeId} not found.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.PROFILE);

    return this.profileRepository.remove(profile);
  }

  async getProjectsByResumeId(resumeId: string) {
    const projects = await this.projectRepository.find({
      where: { resume: { id: resumeId } },
      relations: ['outcomes'],
    });

    if (!projects) {
      return null;
    }

    return {
      id: 'projects',
      type: 'projects',
      items: projects.map((project) => ({
        id: project.id,
        ...project,
      })),
    };
  }

  async syncProjectsForResume(
    resumeId: string,
    createProjectsDto: CreateProjectsWidthOutcomesDto,
  ): Promise<ProjectModel[]> {
    await this.getResume(resumeId);

    const incomingProjects = createProjectsDto.items;
    const incomingIds = incomingProjects.map((p) => p.id);

    const existingProjects = await this.projectRepository.find({
      where: { resume: { id: resumeId } },
      relations: ['outcomes'],
    });

    const toDelete = existingProjects.filter(
      (project) => !incomingIds.includes(project.id),
    );

    if (toDelete.length > 0) {
      for (const project of toDelete) {
        if (project.outcomes && project.outcomes.length > 0) {
          await this.projectOutcomeRepository.remove(project.outcomes);
        }
      }

      await this.projectRepository.remove(toDelete);
    }

    const result: ProjectModel[] = [];

    for (const dto of incomingProjects) {
      const project = await this.upsertProject(resumeId, dto);
      result.push(project);
    }

    return result;
  }

  async upsertProject(
    resumeId: string,
    projectData: CreateProjectDto,
  ): Promise<ProjectModel> {
    const resume = await this.getResume(resumeId);


    let project = await this.projectRepository.findOne({
      where: { id: projectData.id, resume: { id: resume.id } },
      relations: ['outcomes'],
    });

    if (!project) {
      project = this.projectRepository.create({
        ...projectData,
        resume,
      });
    } else {
      Object.assign(project, {
        ...projectData,
      });
    }

    project = await this.projectRepository.save(project);

    await this.projectRepository.save(project);

    await this.syncProjectOutcomes(project.id, projectData.outcomes);

    return this.projectRepository.findOne({
      where: { id: project.id },
      relations: ['outcomes'],
    });
  }

  async removeProject(resumeId: string) {
    await this.projectRepository.delete({
      resume: { id: resumeId },
    });

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.PROJECTS);
  }

  async getProjectOutcomesByProjectId(
    projectId: string,
  ): Promise<ProjectOutcomeModel[]> {
    return this.projectOutcomeRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

  async syncProjectOutcomes(
    projectId: string,
    outcomeDtos: CreateOutcomeDto[],
  ): Promise<ProjectOutcomeModel[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['outcomes'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    const existingOutcomes = project.outcomes || [];

    const incomingIds = outcomeDtos.map((dto) => dto.id);
    const toDelete = existingOutcomes.filter(
      (existing) => !incomingIds.includes(existing.id),
    );
    if (toDelete.length > 0) {
      await this.projectOutcomeRepository.remove(toDelete);
    }

    const result: ProjectOutcomeModel[] = [];

    for (const dto of outcomeDtos) {
      let outcome: ProjectOutcomeModel;

      if (dto.id) {
        outcome = await this.projectOutcomeRepository.findOne({
          where: { id: dto.id, project: { id: projectId } },
        });
      }

      if (!outcome) {
        outcome = this.projectOutcomeRepository.create({
          ...dto,
          project,
        });
      } else {
        Object.assign(outcome, dto);
      }

      const saved = await this.projectOutcomeRepository.save(outcome);
      result.push(saved);
    }

    return result;
  }

  async removeProjectOutcome(projectId: string, outcomeId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    const outcome = await this.projectOutcomeRepository.findOne({
      where: { id: outcomeId, project: { id: project.id } },
    });

    if (!outcome) {
      throw new NotFoundException(
        `Outcome with ID ${outcomeId} for project ID ${projectId} not found.`,
      );
    }

    return this.projectOutcomeRepository.remove(outcome);
  }

  async getSkillsByResumeId(resumeId: string) {
    const resume = await this.getResume(resumeId);

    const strengths = await this.skillRepository.find({
      where: [{ strongResumes: { id: resume.id } }],
    });

    const familiars = await this.skillRepository.find({
      where: [{ familiarResumes: { id: resume.id } }],
    });

    if (!strengths || !familiars) {
      return null;
    }

    return { id: 'skills', type: 'skills', strengths, familiars };
  }

  async setSkillsForResume(
    resumeId: string,
    { strongSkillIds, familiarSkillIds }: CreateSkillsDto,
  ) {
    const resume = await this.getResume(resumeId);

    const [strongSkills, familiarSkills] = await Promise.all([
      this.skillRepository.findBy({ id: In(strongSkillIds.map((s) => s.id)) }),
      this.skillRepository.findBy({
        id: In(familiarSkillIds.map((s) => s.id)),
      }),
    ]);

    resume.str_skills = strongSkills;
    resume.fam_skills = familiarSkills;

    return await this.resumeRepository.save(resume);
  }

  async removeSkills(resumeId: string) {
    const resume = await this.getResume(resumeId);
    

    resume.str_skills = [];
    resume.fam_skills = [];
    

    await this.resumeRepository.save(resume);
  

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.SKILLS);
  }

  async searchSkills(query: string): Promise<SkillModel[]> {
    if (!query) return [];

    return this.skillRepository.find({
      where: {
        name: ILike(`${query}%`),
      },
      order: { name: 'ASC' },
      take: 10,
    });
  }

  async getCareersByResumeId(resumeId: string) {
    const careers = await this.careerRepository.find({
      where: { resume: { id: resumeId } },
    });

    if (!careers) {
      return null;
    }

    return {
      id: 'careers',
      type: 'careers',
      items: careers.map((career) => ({
        id: career.id,
        ...career,
      })),
    };
  }

  async upsertCareer(resumeId: string, careerData: CreateCareersDto) {
    const resume = await this.getResume(resumeId);
    const careers = careerData.items;

    const results = [];
    for (const data of careers) {
      let career = await this.careerRepository.findOne({
        where: { id: data.id, resume: { id: resume.id } },
      });

      if (!career) {
        career = this.careerRepository.create({
          ...data,
          resume,
        });
      } else {
        Object.assign(career, data);
      }
      results.push(await this.careerRepository.save(career));
    }
    return results;
  }

  async getAchievementsByResumeId(resumeId: string) {
    const achievements = await this.achievementRepository.find({
      where: { resume: { id: resumeId } },
    });

    if (!achievements) {
      return null;
    }

    return {
      id: 'achievements',
      type: 'achievements',
      items: achievements.map((achievement) => ({
        id: achievement.id,
        ...achievement,
      })),
    };
  }

  async upsertAchievement(
    resumeId: string,
    achievementData: CreateAchievementsDto,
  ) {
    const resume = await this.getResume(resumeId);
    const achievements = achievementData.items;

    const results = [];
    for (const data of achievements) {
      let achievement = await this.achievementRepository.findOne({
        where: { id: data.id, resume: { id: resume.id } },
      });

      if (!achievement) {
        achievement = this.achievementRepository.create({
          ...data,
          resume,
        });
      } else {
        Object.assign(achievement, data);
      }
      results.push(await this.achievementRepository.save(achievement));
    }
    return results;
  }

  async upsertCustom(resumeId: string, customData: CreateCustomDto) {
    const resume = await this.getResume(resumeId);

    let custom = await this.customRepository.findOne({
      where: { id: customData.id, resume: { id: resume.id } },
    });

    if (!custom) {
      custom = this.customRepository.create({
        ...customData,
        resume,
      });
    } else {
      Object.assign(custom, customData);
    }

    return this.customRepository.save(custom);
  }

  async getCustomsByResumeId(resumeId: string) {
    const customs = await this.customRepository.find({
      where: { resume: { id: resumeId } },
    });

    if (!customs) {
      return null;
    }

    return {
      id: 'customs',
      type: 'customs',
      items: customs.map((custom) => ({
        id: custom.id,
        ...custom,
      })),
    };
  }

  async removeCustom(resumeId: string, customId: string) {
    const resume = await this.getResume(resumeId);

    const custom = await this.customRepository.findOne({
      where: { id: customId, resume: { id: resume.id } },
    });

    if (!custom) {
      throw new NotFoundException(
        `Custom block with ID ${customId} for resume ID ${resumeId} not found.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.CUSTOM, customId);

    return this.customRepository.remove(custom);
  }

  async removeCareer(resumeId: string) {
    await this.getResume(resumeId);

    await this.careerRepository.delete({
      resume: { id: resumeId },
    });

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.CAREERS);
  }

  async removeAchievement(resumeId: string) {
    const resume = await this.getResume(resumeId);

    const achievements = await this.achievementRepository.find({
      where: { resume: { id: resume.id } },
    });

    if (achievements.length === 0) {
      throw new NotFoundException(
        `Achievement for resume ID ${resumeId} not found.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.ACHIEVEMENTS);

    return await this.achievementRepository.remove(achievements);
  }

  async updateBlockOrders(
    resumeId: string,
    updateBlockOrdersDto: UpdateBlockOrdersDto,
  ) {
    const resume = await this.getResume(resumeId);
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    await this.blockOrderRepository.delete({ resume: { id: resumeId } });

    if (updateBlockOrdersDto.blockOrders.length === 0) {
      return [];
    }

    const blockOrders = updateBlockOrdersDto.blockOrders.map((dto) =>
      this.blockOrderRepository.create({
        ...dto,
        resume,
      }),
    );

    await this.blockOrderRepository.save(blockOrders);

    return this.getBlockOrders(resumeId);
  }

  async getBlockOrders(resumeId: string): Promise<string[]> {
    const blockOrders = await this.blockOrderRepository.find({
      where: { resume: { id: resumeId } },
      order: { order: 'ASC' },
    });

    return blockOrders.map((order) =>
      order.blockId ? `${order.blockType}/${order.blockId}` : order.blockType,
    );
  }

  async removeBlockOrdersByBlockId(blockId: string): Promise<void> {
    await this.blockOrderRepository.delete({ blockId });
  }

  async addBlockToOrder(
    resumeId: string,
    blockType: ResumeBlockType,
    blockId?: string,
  ): Promise<void> {
    const currentOrders = await this.getBlockOrders(resumeId);
    const newOrder = currentOrders.length + 1;

    const blockOrder = this.blockOrderRepository.create({
      order: newOrder,
      blockType,
      blockId,
      resume: { id: resumeId },
    });

    await this.blockOrderRepository.save(blockOrder);
  }

  async addBlockToOrderIfNotExists(
    resumeId: string,
    blockType: ResumeBlockType,
    blockId?: string,
  ): Promise<void> {
    const whereCondition =
      blockType === ResumeBlockType.CUSTOM
        ? { resume: { id: resumeId }, blockType, blockId }
        : { resume: { id: resumeId }, blockType };

    const existingOrder = await this.blockOrderRepository.findOne({
      where: whereCondition,
    });

    if (!existingOrder) {
      await this.addBlockToOrder(resumeId, blockType, blockId);
    }
  }

  async removeBlockFromOrder(
    resumeId: string,
    blockType: ResumeBlockType,
    blockId?: string,
  ): Promise<void> {
    const whereCondition =
      blockType === ResumeBlockType.CUSTOM
        ? { resume: { id: resumeId }, blockType, blockId }
        : { resume: { id: resumeId }, blockType };

    await this.blockOrderRepository.delete(whereCondition);

    await this.reorderBlockOrders(resumeId);
  }

  private async reorderBlockOrders(resumeId: string): Promise<void> {
    const currentOrders = await this.blockOrderRepository.find({
      where: { resume: { id: resumeId } },
      order: { order: 'ASC' },
    });

    for (let i = 0; i < currentOrders.length; i++) {
      currentOrders[i].order = i + 1;
    }

    await this.blockOrderRepository.save(currentOrders);
  }
}
