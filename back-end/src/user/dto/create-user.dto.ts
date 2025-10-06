import { IsAlphanumeric, IsEmail, IsString, Length } from 'class-validator';
import { ValidateLength } from 'src/common/decorators/validate-length.decorator';

export class CreateUserDto {
  @IsEmail()
  @ValidateLength('USER_EMAIL')
  email: string;

  @IsString()
  @IsAlphanumeric()
  @Length(8, 15, { message: '비밀번호는 8자 이상 15자 이하여야 합니다.' })
  password: string;

  @IsString()
  @ValidateLength('USER_NAME')
  name: string;
}
