import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidateLength } from 'src/common/decorators/validate-length.decorator';

export class UpdateUserDto {
  @IsEmail()
  @ValidateLength('USER_EMAIL')
  email?: string;

  @IsString()
  @ValidateLength('USER_NAME')
  name: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthDate?: Date;

  @IsNumber()
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
