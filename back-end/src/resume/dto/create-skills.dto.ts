import { IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ResumeBlockType } from '../enum/resume-type.enum';
import { CreateSkillDto } from './create-skill.dto';

export class CreateSkillsDto {
  @IsEnum(ResumeBlockType)
  id: ResumeBlockType.SKILLS;

  @IsEnum(ResumeBlockType)
  type: ResumeBlockType.SKILLS;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  strongSkillIds: CreateSkillDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  familiarSkillIds: CreateSkillDto[];
}
