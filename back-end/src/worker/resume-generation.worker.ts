import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ResumeGenerationService } from 'src/resume/resumeGeneration.Service';
import { Logger } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';

interface CreateResumeJobData {
  profileData: unknown;
  resumeId: string;
  user: User;
}

@Processor('resume-generation-queue')
export class ResumeGenerationWorker extends WorkerHost {
  private readonly logger = new Logger(ResumeGenerationWorker.name);

  constructor(
    private readonly resumeGenerationService: ResumeGenerationService,
  ) {
    super();
  }

  async process(job: Job<CreateResumeJobData>) {
    try {
      const { profileData, resumeId, user } = job.data;

      await this.resumeGenerationService.createResume(
        profileData,
        resumeId,
        user,
      );
    } catch (error) {
      this.logger.error(
        `자소서 생성 작업 실패: ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
