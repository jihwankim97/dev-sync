import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateOutcomeDto } from './create-project-outcome.dto';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  outcomes: CreateOutcomeDto[];
}
