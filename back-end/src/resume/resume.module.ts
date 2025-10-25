import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { UserModule } from 'src/user/user.module';
import { ResumeService } from './resume.service';
import { ResumeGenerationService } from './resumeGeneration.Service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeModel } from './entity/resume.entity';
import { IntroductionModel } from './entity/introduction.entity';
import { ProjectModel } from './entity/project.entity';
import { ProjectOutcomeModel } from './entity/project-outcome.entity';
import { SkillModel } from './entity/skill.entity';
import { ProfileModel } from './entity/profile.entity';
import { SkillSeederService } from './skill_seeder.service';
import { AchievementModel } from './entity/achievement.entity';
import { CareerModel } from './entity/career.entity';
import { CustomModel } from './entity/custom.entity';
import { OrderModel } from './entity/order.entity';
import { githubRepoService } from './github-repo.service';
import { ResumeOwnershipGuard } from './guard/resume-ownership.guard';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ResumeModel,
      IntroductionModel,
      ProjectModel,
      ProjectOutcomeModel,
      SkillModel,
      ProfileModel,
      CareerModel,
      AchievementModel,
      CustomModel,
      OrderModel,
    ]),
  ],
  controllers: [ResumeController],
  providers: [
    ResumeService,
    ResumeGenerationService,
    SkillSeederService,
    githubRepoService,
    ResumeOwnershipGuard,
  ],
  exports: [ResumeService],
})
export class ResumeModule {}
