import { Type } from 'class-transformer';
import { IsString, IsOptional, IsUUID, IsDate } from 'class-validator';

export class CreateAchievementDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
