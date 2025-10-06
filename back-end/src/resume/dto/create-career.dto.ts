import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateCareerDto {
  @IsUUID()
  id: string;

  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  description: string;
}
