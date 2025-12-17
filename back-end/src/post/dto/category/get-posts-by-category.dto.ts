import { IsIn, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_CATEGORY_VALUES } from 'src/post/enum/post-category.enum';

export class GetPostsByCategoryDto {
  @IsString()
  @IsIn(POST_CATEGORY_VALUES, {
    message: `카테고리는 다음 중 하나여야 합니다: ${POST_CATEGORY_VALUES.join(', ')}`,
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  category: string;
}
