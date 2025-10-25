import { IsEmail } from 'class-validator';
import { ValidateLength } from 'src/common/decorator/validate-length.decorator';

export class GetPostsByUserEmailDto {
  @IsEmail()
  @ValidateLength('USER_EMAIL')
  email: string;
}
