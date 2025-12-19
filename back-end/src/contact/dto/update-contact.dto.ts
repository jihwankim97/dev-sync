import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ValidateLength } from 'src/common/decorator/validate-length.decorator';

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @ValidateLength('USER_NAME')
  name?: string;

  @IsOptional()
  @IsEmail()
  @ValidateLength('USER_EMAIL')
  email?: string;

  @IsOptional()
  @IsString()
  @ValidateLength('POST_TITLE')
  title?: string;

  @IsOptional()
  @IsString()
  @ValidateLength('POST_CONTENT')
  content?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4, { message: '비밀번호는 정확히 4자리여야 합니다.' })
  password?: string;
}
