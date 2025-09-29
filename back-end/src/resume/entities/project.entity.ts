import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ResumeModel } from './resume.entity';
import { ProjectOutcomeModel } from './project-outcome.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity()
export class ProjectModel extends BaseUuidModel {

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(() => ResumeModel, (resume) => resume.projects)
  resume: ResumeModel;

  @OneToMany(() => ProjectOutcomeModel, (outcome) => outcome.project, { cascade: true })
  outcomes: ProjectOutcomeModel[];
}
