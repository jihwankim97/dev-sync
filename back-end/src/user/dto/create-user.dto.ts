import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ValidateLength } from 'src/common/decorator/validate-length.decorator';
import { Provider } from '../entity/user.entity';

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

  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider;

  @IsString()
  @IsOptional()
  githubAccessToken?: string;
}
