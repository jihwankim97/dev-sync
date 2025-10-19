import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumeModel } from '../entities/resume.entity';

@Injectable()
export class ResumeOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(ResumeModel)
    private readonly resumeRepository: Repository<ResumeModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resumeId = request.params.id;

    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
      relations: ['author'],
    });

    if (!resume) {
      throw new NotFoundException('이력서를 찾을 수 없습니다.');
    }

    if (resume.author.id !== user.id) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
}
