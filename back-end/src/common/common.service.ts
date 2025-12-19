import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  MoreThan,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BasePaginationDto, SortOrder } from './dto/base-pagination.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';

const ALLOWED_ORDER_BY_FIELDS = ['id', 'createdAt', 'updatedAt', 'viewCount'];

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  applyPagePaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: BasePaginationDto,
    orderBy: string = 'createdAt',
  ): void {
    const { page = 1, take = 20, order = SortOrder.DESC } = dto;
    const skip = (page - 1) * take;

    const safeOrderBy = ALLOWED_ORDER_BY_FIELDS.includes(orderBy)
      ? orderBy
      : 'createdAt';

    qb.take(take);
    qb.skip(skip);
    qb.orderBy(`${qb.alias}.${safeOrderBy}`, order);
  }

  applyPagePaginationParams<T extends ObjectLiteral>(
    dto: BasePaginationDto,
    orderBy: string = 'createdAt',
  ): FindManyOptions<T> {
    const { page = 1, take = 20, order = SortOrder.DESC } = dto;
    const skip = (page - 1) * take;

    const safeOrderBy = ALLOWED_ORDER_BY_FIELDS.includes(orderBy)
      ? orderBy
      : 'createdAt';

    return {
      skip,
      take,
      order: {
        [safeOrderBy]: order,
      } as any,
    };
  }

  applyCursorPaginationParams(dto: CursorPaginationDto) {
    const { take = 20, cursor } = dto;

    const where: any = {};
    if (cursor) {
      where.id = MoreThan(cursor);
    }

    return {
      where,
      take: take + 1,
      order: {
        createdAt: 'ASC',
        id: 'ASC',
      } as any,
    };
  }
}
