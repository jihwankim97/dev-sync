import { Module } from '@nestjs/common';
import { ResumeGenerationWorker } from './resume-generation.worker';
import { QueueModule } from 'src/queue/queue.module';
import { ResumeModule } from 'src/resume/resume.module';

@Module({
  imports: [ResumeModule, QueueModule],
  providers: [ResumeGenerationWorker],
})
export class WorkerModule {}
