import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { ProjectModel } from './project.entity';

@Entity()
export class SkillModel {
  @PrimaryGeneratedColumn()
  id: number;

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
