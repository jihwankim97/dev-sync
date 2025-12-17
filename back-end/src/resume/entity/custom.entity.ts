import { Column, Entity, ManyToOne } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_custom')
export class CustomModel extends BaseUuidModel {
  @Column()
  title: string;

  @Column({ length: 500 })
  description: string;

  @ManyToOne(() => ResumeModel, (resume) => resume.customs, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  resume: ResumeModel;
}
