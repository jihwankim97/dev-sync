import { IsString } from 'class-validator';
import { ValidateLength } from 'src/common/decorators/validate-length.decorator';

export class UpdateCommentDto {
  @IsString()
  @ValidateLength('COMMENT_CONTENT')
  comment: string;
}
