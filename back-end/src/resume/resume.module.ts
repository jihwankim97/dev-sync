import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { UserModule } from 'src/user/user.module';
import { SessionSerializer } from 'src/auth/session.serializer';
import { ResumeService } from './resume.service';
import { ResumeGenerationService } from './resumeGeneration.Service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeModel } from './entities/resume.entity';
import { IntroductionModel } from './entities/introduction.entity';
import { ProjectModel } from './entities/project.entity';
import { ProjectOutcomeModel } from './entities/project-outcome.entity';
import { SkillModel } from './entities/skill.entity';
import { ProfileModel } from './entities/profile.entity';
import { SkillSeederService } from './skill_seeder.service';
import { AchievementModel } from './entities/achievement.entity';
import { CareerModel } from './entities/career.entity';
import { CustomModel } from './entities/custom.entity';
import { OrderModel } from './entities/order.entity';
import { githubRepoService } from './github-repo.service';
import { CommonModule } from 'src/common/common.module';
import { ResumeOwnershipGuard } from './guard/resume-ownership.guard';

@Module({
  imports: [
    UserModule,
    CommonModule,
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
    SessionSerializer,
    ResumeService,
    ResumeGenerationService,
    SkillSeederService,
    githubRepoService,
    ResumeOwnershipGuard,
  ],
  exports: [ResumeService],
})
export class ResumeModule {}
