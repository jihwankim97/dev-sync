import { IsArray, ValidateNested, IsNumber, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ResumeBlockType } from '../enum/resume-type.enum';

export class BlockOrderItemDto {
  @IsNumber()
  order: number;

  @IsEnum(ResumeBlockType)
  blockType: ResumeBlockType;

  @IsUUID()
  @IsOptional()
  blockId?: string; // 커스텀 블록의 경우에만 사용
}

export class UpdateBlockOrdersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockOrderItemDto)
  blockOrders: BlockOrderItemDto[];
}
