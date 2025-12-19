import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'take는 최소 1 이상이어야 합니다.' })
  @Max(100, { message: 'take는 최대 100까지 가능합니다.' })
  take?: number;

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}
