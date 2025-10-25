import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidateLength } from 'src/common/decorator/validate-length.decorator';

export class UpdateUserDto {
  @IsString()
  @ValidateLength('USER_NAME')
  @IsOptional()
  name?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsNumber()
  @IsOptional()
  phoneNumber?: number;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  blogUrl?: string;

  @IsString()
  @IsOptional()
  educationLevel?: string;

  @IsString()
  @IsOptional()
  universityName?: string;

  @IsString()
  @IsOptional()
  departmentName?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
