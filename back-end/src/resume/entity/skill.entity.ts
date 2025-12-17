import { Column, Entity, ManyToMany } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class SkillModel extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToMany(() => ResumeModel, (resume) => resume.strSkills, {
    onDelete: 'CASCADE',
  })
  strongResumes: ResumeModel[];

  @ManyToMany(() => ResumeModel, (resume) => resume.famSkills, {
    onDelete: 'CASCADE',
  })
  familiarResumes: ResumeModel[];
}
