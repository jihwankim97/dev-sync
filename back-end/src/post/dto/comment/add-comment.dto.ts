import { IsInt, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { ValidateLength } from 'src/common/decorators/validate-length.decorator';

export class AddCommentDto {
  @IsOptional()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt()
  @Min(1)
  parentId?: number | null;

  @IsString()
  @ValidateLength('COMMENT_CONTENT')
  comment: string;
}
