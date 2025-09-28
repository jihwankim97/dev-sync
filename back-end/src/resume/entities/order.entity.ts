import { BaseUuidModel } from 'src/common/entity/base.entity';
import { ResumeModel } from './resume.entity';
import { ResumeBlockType } from '../enum/resume-type.enum';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class OrderModel extends BaseUuidModel {

  @Column()
  order: number;

  @Column({
    type: 'enum',
    enum: ResumeBlockType
  })
  blockType: ResumeBlockType;

  @Column({ nullable: true })
  blockId: string; // 커스텀 블록의 경우에만 사용

  @ManyToOne(() => ResumeModel, (resume) => resume.blockOrders, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeModel;
}
