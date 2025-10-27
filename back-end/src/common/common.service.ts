import { Injectable } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BasePaginationDto } from './dto/base-pagination.dto';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  applyPagePaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: BasePaginationDto,
  ): void {
    const { page = 1, take = 20 } = dto;
    const skip = (page - 1) * take;

    qb.take(take);
    qb.skip(skip);
  }

  applyPagePaginationParams<T extends ObjectLiteral>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    const { page = 1, take = 20 } = dto;
    const skip = (page - 1) * take;

    return {
      skip,
      take,
    };
  }
}
