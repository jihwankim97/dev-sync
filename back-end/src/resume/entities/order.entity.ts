import { BaseUuidModel } from 'src/common/entity/base.entity';
import { ResumeModel } from './resume.entity';
import { ResumeBlockType } from '../enum/resume-type.enum';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('resume_block_order')
export class OrderModel extends BaseUuidModel {
  @Column()
  order: number;

  @Column({
    type: 'enum',
    enum: ResumeBlockType,
    name: 'block_type',
  })
  blockType: ResumeBlockType;

  @Column({ nullable: true, name: 'block_id' })
  blockId: string; // 커스텀 블록의 경우에만 사용

  @ManyToOne(() => ResumeModel, (resume) => resume.blockOrders, {
    onDelete: 'CASCADE',
  })
  resume: ResumeModel;
}
