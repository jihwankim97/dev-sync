import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { ProjectOutcomeModel } from './project-outcome.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_project')
export class ProjectModel extends BaseUuidModel {
  @Column()
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ nullable: true, name: 'end_date' })
  endDate: Date;

  @ManyToOne(() => ResumeModel, (resume) => resume.projects, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  resume: ResumeModel;

  @OneToMany(() => ProjectOutcomeModel, (outcome) => outcome.project, {
    cascade: true,
  })
  outcomes: ProjectOutcomeModel[];
}
