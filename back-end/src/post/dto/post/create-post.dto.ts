import { IsIn, IsInt, IsString, Length, Min } from 'class-validator';
import { ValidateLength } from 'src/common/decorators/validate-length.decorator';
import { POST_CATEGORY_VALUES } from 'src/post/enum/post-category.enum';

export class CreatePostDto {
  @IsString()
  @Length(1, 100)
  @ValidateLength('POST_TITLE')
  title: string;

  @IsString()
  @ValidateLength('POST_CONTENT')
  content: string;

  @IsString()
  @IsIn(POST_CATEGORY_VALUES, {
    message: `카테고리는 다음 중 하나여야 합니다: ${POST_CATEGORY_VALUES.join(', ')}`,
  })
  category: string;

  @IsInt()
  @Min(1)
  postId: number;
}
