import { Type } from 'class-transformer';
import { IsString, IsOptional, IsUUID, IsDate } from 'class-validator';

export class CreateCareerDto {
  @IsUUID()
  id: string;

  @IsString()
  company: string;

  @IsString()
  position: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  description: string;
}
