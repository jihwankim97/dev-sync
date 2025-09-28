import { Column, Entity, ManyToMany } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { ProjectModel } from './project.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class SkillModel extends BaseModel {

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToMany(() => ResumeModel, (resume) => resume.str_skills, { onDelete: 'CASCADE' })
  strongResumes: ResumeModel[];

  @ManyToMany(() => ResumeModel, (resume) => resume.fam_skills, { onDelete: 'CASCADE' })
  familiarResumes: ResumeModel[];

  @ManyToMany(() => ProjectModel, (project) => project.skills, { onDelete: 'CASCADE' })
  projects: ProjectModel[];
  
}
