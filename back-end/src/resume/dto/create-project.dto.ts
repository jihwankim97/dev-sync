import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateOutcomeDto } from './create-project-outcome.dto';
import { Type } from 'class-transformer';
import { CreateSkillDto } from './create-skill.dto';

export class CreateProjectDto {

  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  skills: CreateSkillDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOutcomeDto)
  outcomes: CreateOutcomeDto[];
}
