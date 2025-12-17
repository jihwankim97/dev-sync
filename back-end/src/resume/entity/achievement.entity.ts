import { Column, Entity, ManyToOne } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_achievement')
export class AchievementModel extends BaseUuidModel {
  @Column()
  title: string;

  @Column({ nullable: true })
  organization: string;

  @Column()
  date: Date;

  @Column({ nullable: true, length: 500 })
  description: string;

  @ManyToOne(() => ResumeModel, (resume) => resume.achievements, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  resume: ResumeModel;
}
