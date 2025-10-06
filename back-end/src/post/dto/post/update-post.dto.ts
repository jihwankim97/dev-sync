import { IsIn, IsOptional, IsString } from 'class-validator';
import { ValidateLength } from 'src/common/decorators/validate-length.decorator';
import { POST_CATEGORY_VALUES } from 'src/post/enum/post-category.enum';

export class UpdatePostDto {
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
  @IsIn(POST_CATEGORY_VALUES, {
    message: `카테고리는 다음 중 하나여야 합니다: ${POST_CATEGORY_VALUES.join(', ')}`,
  })
  category?: string;
}
