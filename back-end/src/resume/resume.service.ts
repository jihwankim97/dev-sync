import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeModel } from './entity/resume.entity';
import { ILike, Repository } from 'typeorm';
import { IntroductionModel } from './entity/introduction.entity';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { SkillModel } from './entity/skill.entity';
import { ProfileModel } from './entity/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProjectModel } from './entity/project.entity';
import { ProjectOutcomeModel } from './entity/project-outcome.entity';
import { CreateOutcomeDto } from './dto/create-project-outcome.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectsWidthOutcomesDto } from './dto/create-projects-width-outcomes.dto';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { CareerModel } from './entity/career.entity';
import { AchievementModel } from './entity/achievement.entity';
import { CreateAchievementsDto } from './dto/create-achievements.dto';
import { CreateCareersDto } from './dto/create-careers.dto';
import { CustomModel } from './entity/custom.entity';
import { CreateCustomDto } from './dto/create-custom.dto';
import { OrderModel } from './entity/order.entity';
import { UpdateBlockOrdersDto } from './dto/update-block-orders.dto';
import { ResumeBlockType } from './enum/resume-type.enum';
import { User } from 'src/user/entity/user.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ResumeService {
  constructor(
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
    @InjectRepository(CareerModel)
    private readonly careerRepository: Repository<CareerModel>,
    @InjectRepository(AchievementModel)
    private readonly achievementRepository: Repository<AchievementModel>,
    @InjectRepository(CustomModel)
    private readonly customRepository: Repository<CustomModel>,
    @InjectRepository(OrderModel)
    private readonly blockOrderRepository: Repository<OrderModel>,
  ) {}

  @Transactional()
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
        result = await this.syncProjects(resumeId, entityData);
        blockType = ResumeBlockType.PROJECTS;
        break;
      case 'skills':
        result = await this.upsertSkills(resumeId, entityData);
        blockType = ResumeBlockType.SKILLS;
        break;
      case 'careers':
        result = await this.syncCareers(resumeId, entityData);
        blockType = ResumeBlockType.CAREERS;
        break;
      case 'achievements':
        result = await this.syncAchievements(resumeId, entityData);
        blockType = ResumeBlockType.ACHIEVEMENTS;
        break;
      case 'custom':
        result = await this.upsertCustom(resumeId, entityData);
        blockType = ResumeBlockType.CUSTOM;
        blockId = entityData.id;
        break;
    }

    if (result && (!Array.isArray(result) || result.length > 0)) {
      await this.addBlockToOrderIfNotExists(resumeId, blockType, blockId);
    }

    return result;
  }

  findAll(id: number) {
    return this.resumeRepository.find({
      where: { author: { id: id } },
      relations: ['profile', 'strSkills', 'famSkills'],
    });
  }

  private async findOne(id: string) {
    return this.resumeRepository.findOne({
      where: { id },
    });
  }

  async findDetail(id: string) {
    const resume = await this.resumeRepository.findOne({ where: { id } });

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
      this.findProfile(resume.id),
      this.findIntroduction(resume.id),
      this.findSkills(resume.id),
      this.findProjects(resume.id),
      this.findCareers(resume.id),
      this.findAchievements(resume.id),
      this.findCustoms(resume.id),
      this.findBlockOrders(resume.id),
    ]);

    const entities = [];

    if (profile) {
      entities.push(profile);
    }

    if (introduction) {
      entities.push(introduction);
    }

    if (skills) {
      entities.push(skills);
    }
    if (projects && projects.items.length > 0) {
      entities.push(projects);
    }
    if (careers && careers.items.length > 0) {
      entities.push(careers);
    }
    if (achievements && achievements.items.length > 0) {
      entities.push(achievements);
    }
    if (customs && customs.items.length > 0) {
      entities.push(...customs.items);
    }

    return {
      id: resume.id,
      title: resume.title,
      order: blockOrders,
      entities,
    };
  }

  async create(user: User, title: string) {
    return this.resumeRepository.save({
      title,
      author: user,
    });
  }

  async remove(resumeId: string) {
    const result = await this.resumeRepository.delete(resumeId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${resumeId}인 포트폴리오가 존재하지 않습니다.`,
      );
    }

    return { message: '포트폴리오가 삭제되었습니다.', id: resumeId };
  }

  async findIntroduction(resumeId: string) {
    const introduction = await this.introductionRepository.findOne({
      where: { resume: { id: resumeId } },
    });

    if (!introduction) {
      return null;
    }

    return { id: introduction.id, type: 'introduction', ...introduction };
  }

  private async upsertIntroduction(
    resumeId: string,
    dto: CreateIntroductionDto,
  ) {
    let introduction = await this.introductionRepository.findOne({
      where: { resume: { id: resumeId } },
    });

    if (!introduction) {
      introduction = this.introductionRepository.create({
        resume: { id: resumeId },
      });
    }

    introduction.headline = dto.headline;
    introduction.description = dto.description;

    await this.introductionRepository.save(introduction);

    return { message: '소개가 생성되었습니다.', id: introduction.id };
  }

  @Transactional()
  async removeIntroduction(resumeId: string) {
    const result = await this.introductionRepository.delete({
      resume: { id: resumeId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${resumeId}인 소개가 존재하지 않습니다.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.INTRODUCTION);

    return { message: '소개가 삭제되었습니다.', id: resumeId };
  }

  async findProfile(resumeId: string) {
    const profile = await this.profileRepository.findOne({
      where: { resume: { id: resumeId } },
    });

    if (!profile) {
      return null;
    }

    return { id: profile.id, type: 'profile', ...profile };
  }

  private async upsertProfile(resumeId: string, profileDto: CreateProfileDto) {
    let profile = await this.profileRepository.findOne({
      where: { resume: { id: resumeId } },
    });

    if (!profile) {
      profile = this.profileRepository.create({
        resume: { id: resumeId },
      });
    }

    profile.name = profileDto.name;
    profile.email = profileDto.email;
    profile.phoneNumber = profileDto.phoneNumber;
    profile.address = profileDto.address;
    profile.education = profileDto.education;
    profile.githubUrl = profileDto.githubUrl;
    profile.blogUrl = profileDto.blogUrl;

    await this.profileRepository.save(profile);

    return { message: '프로필이 생성되었습니다.', id: profile.id };
  }

  @Transactional()
  async removeProfile(resumeId: string) {
    const result = await this.profileRepository.delete({
      resume: { id: resumeId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${resumeId}인 프로필이 존재하지 않습니다.`,
      );
    }
    await this.removeBlockFromOrder(resumeId, ResumeBlockType.PROFILE);

    return { message: '프로필이 삭제되었습니다.', id: resumeId };
  }

  async findProjects(resumeId: string) {
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

  @Transactional()
  async syncProjects(
    resumeId: string,
    createProjectsDto: CreateProjectsWidthOutcomesDto,
  ) {
    const incomingProjects = createProjectsDto.items;
    const incomingIds = incomingProjects.map((p) => p.id);

    const existingProjects = await this.projectRepository.find({
      where: { resume: { id: resumeId } },
    });

    const toDelete = existingProjects.filter(
      (project) => !incomingIds.includes(project.id),
    );

    if (toDelete.length > 0) {
      await this.projectRepository.delete(toDelete.map((p) => p.id));
    }

    const result = await Promise.all(
      incomingProjects.map((dto) => this.upsertProject(resumeId, dto)),
    );

    return result;
  }

  private async upsertProject(resumeId: string, projectData: CreateProjectDto) {
    let project = await this.projectRepository.findOne({
      where: { id: projectData.id, resume: { id: resumeId } },
      relations: ['outcomes'],
    });

    if (!project) {
      project = this.projectRepository.create({
        ...projectData,
        resume: { id: resumeId },
      });
    } else {
      project.name = projectData.name;
      project.description = projectData.description;
      project.startDate = projectData.startDate;
      project.endDate = projectData.endDate;
    }

    project = await this.projectRepository.save(project);

    await this.syncProjectOutcomes(project, projectData.outcomes);

    return { message: '프로젝트가 생성되었습니다.', id: project.id };
  }

  @Transactional()
  async removeProject(resumeId: string) {
    const result = await this.projectRepository.delete({
      resume: { id: resumeId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${resumeId}인 프로젝트가 존재하지 않습니다.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.PROJECTS);
    return { message: '프로젝트가 삭제되었습니다.', id: resumeId };
  }

  @Transactional()
  async syncProjectOutcomes(
    project: ProjectModel,
    outcomeDtos: CreateOutcomeDto[],
  ) {
    const existingOutcomes = project.outcomes || [];

    const incomingIds = outcomeDtos.map((dto) => dto.id);
    const toDelete = existingOutcomes.filter(
      (existing) => !incomingIds.includes(existing.id),
    );

    if (toDelete.length > 0) {
      await this.projectOutcomeRepository.remove(toDelete);
    }

    const result = await Promise.all(
      outcomeDtos.map((dto) => this.upsertProjectOutcome(project, dto)),
    );

    return result;
  }

  private async upsertProjectOutcome(
    project: ProjectModel,
    outcomeDto: CreateOutcomeDto,
  ) {
    let outcome = await this.projectOutcomeRepository.findOne({
      where: { id: outcomeDto.id, project: { id: project.id } },
    });

    if (!outcome) {
      outcome = this.projectOutcomeRepository.create({
        ...outcomeDto,
        project,
      });
    } else {
      outcome.task = outcomeDto.task;
      outcome.result = outcomeDto.result;
    }

    await this.projectOutcomeRepository.save(outcome);
    return { message: '결과가 생성되었습니다.', id: outcome.id };
  }

  private async removeProjectOutcome(projectId: string, outcomeId: string) {
    const result = await this.projectOutcomeRepository.delete({
      id: outcomeId,
      project: { id: projectId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${outcomeId}인 결과가 존재하지 않습니다.`,
      );
    }

    return { message: '결과가 삭제되었습니다.', id: outcomeId };
  }

  async findSkills(resumeId: string) {
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
      relations: ['strSkills', 'famSkills'],
    });

    const strengths = resume.strSkills;
    const familiars = resume.famSkills;

    if (strengths.length === 0 && familiars.length === 0) {
      return null;
    }

    return { id: 'skills', type: 'skills', strengths, familiars };
  }

  async upsertSkills(
    resumeId: string,
    { strongSkillIds, familiarSkillIds }: CreateSkillsDto,
  ) {
    await this.resumeRepository.save({
      id: resumeId,
      strSkills: strongSkillIds.map((s) => ({ id: s.id })),
      famSkills: familiarSkillIds.map((s) => ({ id: s.id })),
    });

    return { message: '스킬이 업데이트되었습니다.' };
  }

  @Transactional()
  async removeSkills(resumeId: string) {
    await this.resumeRepository.save({
      id: resumeId,
      strSkills: [],
      famSkills: [],
    });

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.SKILLS);

    return { message: '스킬이 삭제되었습니다.', id: resumeId };
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

  async findCareers(resumeId: string) {
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

  @Transactional()
  async syncCareers(resumeId: string, careerData: CreateCareersDto) {
    const incomingCareers = careerData.items;
    const incomingIds = incomingCareers.map((c) => c.id);

    const existingCareers = await this.careerRepository.find({
      where: { resume: { id: resumeId } },
    });

    const toDelete = existingCareers.filter(
      (career) => !incomingIds.includes(career.id),
    );

    if (toDelete.length > 0) {
      await this.careerRepository.delete(toDelete.map((c) => c.id));
    }

    const results = await Promise.all(
      incomingCareers.map((data) => this.upsertCareer(resumeId, data)),
    );

    return results;
  }

  private async upsertCareer(resumeId: string, data: CreateCareerDto) {
    let career = await this.careerRepository.findOne({
      where: { id: data.id, resume: { id: resumeId } },
    });

    if (!career) {
      career = this.careerRepository.create({
        ...data,
        resume: { id: resumeId },
      });
    } else {
      career.company = data.company;
      career.position = data.position;
      career.startDate = data.startDate;
      career.endDate = data.endDate;
      career.description = data.description;
    }

    await this.careerRepository.save(career);
    return { message: '경력이 생성되었습니다.', id: career.id };
  }

  async findAchievements(resumeId: string) {
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

  @Transactional()
  async syncAchievements(
    resumeId: string,
    achievementData: CreateAchievementsDto,
  ) {
    const incomingAchievements = achievementData.items;
    const incomingIds = incomingAchievements.map((a) => a.id);

    const existingAchievements = await this.achievementRepository.find({
      where: { resume: { id: resumeId } },
    });

    const toDelete = existingAchievements.filter(
      (achievement) => !incomingIds.includes(achievement.id),
    );

    if (toDelete.length > 0) {
      await this.achievementRepository.delete(toDelete.map((a) => a.id));
    }

    const results = await Promise.all(
      incomingAchievements.map((data) =>
        this.upsertAchievement(resumeId, data),
      ),
    );

    return results;
  }

  private async upsertAchievement(
    resumeId: string,
    data: CreateAchievementDto,
  ) {
    let achievement = await this.achievementRepository.findOne({
      where: { id: data.id, resume: { id: resumeId } },
    });

    if (!achievement) {
      achievement = this.achievementRepository.create({
        ...data,
        resume: { id: resumeId },
      });
    } else {
      achievement.title = data.title;
      achievement.organization = data.organization;
      achievement.date = data.date;
      achievement.description = data.description;
    }

    await this.achievementRepository.save(achievement);
    return { message: '업력이 생성되었습니다.', id: achievement.id };
  }

  private async upsertCustom(resumeId: string, customData: CreateCustomDto) {
    let custom = await this.customRepository.findOne({
      where: { id: customData.id, resume: { id: resumeId } },
    });

    if (!custom) {
      custom = this.customRepository.create({
        ...customData,
        resume: { id: resumeId },
      });
    } else {
      custom.title = customData.title;
      custom.description = customData.description;
    }

    await this.customRepository.save(custom);

    return { message: '커스텀이 생성되었습니다.', id: custom.id };
  }

  async findCustoms(resumeId: string) {
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

  @Transactional()
  async removeCustom(resumeId: string, customId: string) {
    const result = await this.customRepository.delete({
      id: customId,
      resume: { id: resumeId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${customId}인 커스텀이 존재하지 않습니다.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.CUSTOM, customId);

    return { message: '커스텀이 삭제되었습니다.', id: customId };
  }

  @Transactional()
  async removeCareer(resumeId: string) {
    const result = await this.careerRepository.delete({
      resume: { id: resumeId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${resumeId}인 경력이 존재하지 않습니다.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.CAREERS);
    return { message: '경력이 삭제되었습니다.', id: resumeId };
  }

  @Transactional()
  async removeAchievement(resumeId: string) {
    const result = await this.achievementRepository.delete({
      resume: { id: resumeId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `아이디가 ${resumeId}인 업적이 존재하지 않습니다.`,
      );
    }

    await this.removeBlockFromOrder(resumeId, ResumeBlockType.ACHIEVEMENTS);

    return { message: '업적이 삭제되었습니다.', id: resumeId };
  }

  @Transactional()
  async updateBlockOrders(
    resumeId: string,
    updateBlockOrdersDto: UpdateBlockOrdersDto,
  ) {
    await this.blockOrderRepository.delete({ resume: { id: resumeId } });

    if (updateBlockOrdersDto.blockOrders.length === 0) {
      return [];
    }

    const blockOrders = updateBlockOrdersDto.blockOrders.map((dto) =>
      this.blockOrderRepository.create({
        ...dto,
        resume: { id: resumeId },
      }),
    );

    await this.blockOrderRepository.save(blockOrders);

    return this.findBlockOrders(resumeId);
  }

  async findBlockOrders(resumeId: string): Promise<string[]> {
    const blockOrders = await this.blockOrderRepository.find({
      where: { resume: { id: resumeId } },
      order: { order: 'ASC' },
    });

    return blockOrders.map((order) =>
      order.blockId ? `${order.blockType}/${order.blockId}` : order.blockType,
    );
  }

  async removeBlockOrder(blockId: string): Promise<void> {
    await this.blockOrderRepository.delete({ blockId });
  }

  private async addBlockToOrder(
    resumeId: string,
    blockType: ResumeBlockType,
    blockId?: string,
  ): Promise<void> {
    const currentOrders = await this.findBlockOrders(resumeId);
    const newOrder = currentOrders.length + 1;

    const blockOrder = this.blockOrderRepository.create({
      order: newOrder,
      blockType,
      blockId,
      resume: { id: resumeId },
    });

    await this.blockOrderRepository.save(blockOrder);
  }

  private async addBlockToOrderIfNotExists(
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

  private async removeBlockFromOrder(
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
