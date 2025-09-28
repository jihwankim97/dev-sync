import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ResumeBlockType } from '../enum/resume-type.enum';

export class CreateIntroductionDto {
  @IsUUID()
  id: string;

  @IsEnum(ResumeBlockType)
  type: ResumeBlockType.INTRODUCTION;

  @IsString()
  headline: string;

  @IsString()
  description: string;
}
