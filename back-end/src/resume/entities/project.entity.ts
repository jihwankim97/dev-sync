import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeModel } from './resume.entity';
import { ProjectOutcomeModel } from './project-outcome.entity';
import { SkillModel } from './skill.entity';

@Entity()
export class ProjectModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToMany(() => SkillModel, { cascade: true })
  @JoinTable({
    name: 'project_skills',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: SkillModel[];
}
