import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectModel } from './project.entity';

@Entity()
export class ProjectOutcomeModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  task: string;

  @Column()
  result: string;

  @ManyToOne(() => ProjectModel, (resume) => resume.outcomes, { onDelete: 'CASCADE' })
  project: ProjectModel;
}
