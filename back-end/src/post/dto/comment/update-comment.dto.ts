import { IsString } from 'class-validator';
import { ValidateLength } from 'src/common/decorator/validate-length.decorator';

export class UpdateCommentDto {
  @IsString()
  @ValidateLength('COMMENT_CONTENT')
  comment: string;
}
