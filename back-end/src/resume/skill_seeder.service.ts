import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillModel } from './entity/skill.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

interface DeviconItem {
  name: string;
  versions?: {
    font?: {
      plain?: string[];
    };
    svg?:
      | {
          plain?: string[];
        }
      | string[];
  };
}

interface SkillData {
  name: string;
  icon: string;
}

@Injectable()
export class SkillSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(SkillModel)
    private readonly skillRepository: Repository<SkillModel>,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(SkillSeederService.name);
  private readonly DEVCON_API_URL =
    this.configService.get<string>('DEVCON_API_URL') ||
    'https://raw.githubusercontent.com/devicons/devicon/master/devicon.json';
  private readonly BATCH_SIZE = 50;

  async onModuleInit() {
    this.logger.log('Initializing Skill Table with Devicon data...');

    try {
      const skills = await this.fetchDeviconSkills();
      await this.processSkillsInBatches(skills);
      this.logger.log(`Successfully processed ${skills.length} skills`);
    } catch (error) {
      this.logger.error('Failed to initialize skills', error);
    }
  }

  private async processSkillsInBatches(skills: SkillData[]): Promise<void> {
    const existingSkills = await this.skillRepository.find();
    const existingSkillsMap = new Map(
      existingSkills.map((skill) => [skill.name, skill]),
    );

    const skillsToInsert: SkillData[] = [];
    const skillsToUpdate: SkillModel[] = [];

    for (const skillData of skills) {
      const existing = existingSkillsMap.get(skillData.name);

      if (!existing) {
        skillsToInsert.push(skillData);
      } else if (!existing.icon) {
        existing.icon = skillData.icon;
        skillsToUpdate.push(existing);
      }
    }

    if (skillsToInsert.length > 0) {
      await this.insertSkillsInBatches(skillsToInsert);
      this.logger.log(`Inserted ${skillsToInsert.length} new skills`);
    }

    if (skillsToUpdate.length > 0) {
      await this.updateSkillsInBatches(skillsToUpdate);
      this.logger.log(`Updated ${skillsToUpdate.length} existing skills`);
    }
  }

  private async insertSkillsInBatches(skills: SkillData[]): Promise<void> {
    for (let i = 0; i < skills.length; i += this.BATCH_SIZE) {
      const batch = skills.slice(i, i + this.BATCH_SIZE);
      const entities = batch.map((skill) => this.skillRepository.create(skill));
      await this.skillRepository.save(entities);
    }
  }

  private async updateSkillsInBatches(skills: SkillModel[]): Promise<void> {
    for (let i = 0; i < skills.length; i += this.BATCH_SIZE) {
      const batch = skills.slice(i, i + this.BATCH_SIZE);
      await this.skillRepository.save(batch);
    }
  }

  private async fetchDeviconSkills(): Promise<SkillData[]> {
    try {
      const response = await axios.get<DeviconItem[]>(this.DEVCON_API_URL, {
        timeout: 10000,
      });

      const skills: SkillData[] = [];

      for (const item of response.data) {
        if (!item.name) continue;

        const iconClass = this.extractIconClass(item);

        if (iconClass) {
          this.logger.log(`Skill: ${item.name} -> Icon: ${iconClass}`);

          skills.push({
            name: item.name,
            icon: iconClass,
          });
        }
      }

      return skills;
    } catch (error) {
      this.logger.error('Failed to fetch Devicon data', error);

      return [];
    }
  }

  private extractIconClass(item: DeviconItem): string | null {
    const fontPlain = item?.versions?.font?.plain?.[0];
    const fontOriginal = item?.versions?.font?.[0];

    const svgPlain = (item?.versions?.svg as any)?.plain?.[0];
    const svgOriginal = Array.isArray(item?.versions?.svg)
      ? item.versions.svg[0]
      : undefined;

    const iconType = fontPlain || fontOriginal || svgPlain || svgOriginal;

    if (iconType) {
      return `devicon-${item.name}-${iconType}`;
    }

    return null;
  }
}
