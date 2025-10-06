import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { ResumeBlockType } from '../enum/resume-type.enum';
import { Type } from 'class-transformer';
import { CreateCareerDto } from './create-career.dto';

export class CreateCareersDto {
  @IsEnum(ResumeBlockType)
  id: ResumeBlockType.CAREERS;

  @IsEnum(ResumeBlockType)
  type: ResumeBlockType.CAREERS;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCareerDto)
  items: CreateCareerDto[];
}
