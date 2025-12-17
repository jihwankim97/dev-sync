import { IsString, IsUUID, IsEnum } from 'class-validator';
import { ResumeBlockType } from '../enum/resume-type.enum';

export class CreateCustomDto {
  @IsUUID()
  id: string;

  @IsEnum(ResumeBlockType)
  type: ResumeBlockType.CUSTOM;

  @IsString()
  title: string;

  @IsString()
  description: string;
}