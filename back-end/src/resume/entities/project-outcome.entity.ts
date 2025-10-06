import { Column, Entity, ManyToOne } from 'typeorm';
import { ProjectModel } from './project.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_project_outcome')
export class ProjectOutcomeModel extends BaseUuidModel {
  @Column()
  task: string;

  @Column()
  result: string;

  @ManyToOne(() => ProjectModel, (resume) => resume.outcomes, {
    onDelete: 'CASCADE',
  })
  project: ProjectModel;
}
