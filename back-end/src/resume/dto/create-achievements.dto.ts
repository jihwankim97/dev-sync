import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { CreateAchievementDto } from './create-achievement.dto';
import { Type } from 'class-transformer';
import { ResumeBlockType } from '../enum/resume-type.enum';

export class CreateAchievementsDto {
  @IsEnum(ResumeBlockType)
  id: ResumeBlockType.ACHIEVEMENTS;

  @IsEnum(ResumeBlockType)
  type: ResumeBlockType.ACHIEVEMENTS;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAchievementDto)
  items: CreateAchievementDto[];
}
