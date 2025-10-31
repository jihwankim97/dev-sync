import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { SortOrder } from './base-pagination.dto';

export class CursorPaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  cursor?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'take는 최소 1 이상이어야 합니다.' })
  @Max(50, { message: 'take는 최대 50까지 가능합니다.' })
  take?: number;

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}
