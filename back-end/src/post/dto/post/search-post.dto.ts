import { IsString, IsOptional, IsIn } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { POST_CATEGORY_VALUES } from 'src/post/enum/post-category.enum';

export class SearchPostDto extends BasePaginationDto {
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  @IsIn(POST_CATEGORY_VALUES, {
    message: `카테고리는 다음 중 하나여야 합니다: ${POST_CATEGORY_VALUES.join(', ')}`,
  })
  category?: string;

  @IsOptional()
  @IsString()
  type?: 'title' | 'content' | 'all';
}
