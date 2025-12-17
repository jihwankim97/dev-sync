import { Type } from 'class-transformer';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';
import { ResumeBlockType } from '../enum/resume-type.enum';

export class CreateProjectsWidthOutcomesDto {
  @IsEnum(ResumeBlockType)
  id: ResumeBlockType.PROJECTS;

  @IsEnum(ResumeBlockType)
  type: ResumeBlockType.PROJECTS;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectDto)
  items: CreateProjectDto[];
}
