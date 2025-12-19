import { Column, Entity, ManyToOne } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_career')
export class CareerModel extends BaseUuidModel {
  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ length: 500 })
  description: string;

  @ManyToOne(() => ResumeModel, (resume) => resume.careers, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  resume: ResumeModel;
}
