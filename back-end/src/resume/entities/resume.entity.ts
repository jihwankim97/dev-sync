import { BaseUuidModel } from 'src/common/entity/base.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IntroductionModel } from './introduction.entity';
import { SkillModel } from './skill.entity';
import { ProjectModel } from './project.entity';
import { ProfileModel } from './profile.entity';
import { CareerModel } from './career.entity';
import { AchievementModel } from './achievement.entity';
import { CustomModel } from './custom.entity';
import { OrderModel } from './order.entity';

@Entity('resume')
export class ResumeModel extends BaseUuidModel {
  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.resumes, { onDelete: 'CASCADE' })
  author: User;

  @OneToOne(() => IntroductionModel, (introduction) => introduction.resume, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  introduction: IntroductionModel;

  @OneToOne(() => ProfileModel, (profile) => profile.resume, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile: ProfileModel;

  @ManyToMany(() => SkillModel, (skill) => skill.strongResumes)
  @JoinTable({
    name: 'resume_strong_skills',
    joinColumn: { name: 'resume_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  strSkills: SkillModel[];

  @ManyToMany(() => SkillModel, (skill) => skill.familiarResumes)
  @JoinTable({
    name: 'resume_familiar_skills',
    joinColumn: { name: 'resume_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  famSkills: SkillModel[];

  @OneToMany(() => ProjectModel, (project) => project.resume, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  projects: ProjectModel[];

  @OneToMany(() => CareerModel, (career) => career.resume, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  careers: CareerModel[];

  @OneToMany(() => AchievementModel, (achievement) => achievement.resume, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  achievements: AchievementModel[];

  @OneToMany(() => CustomModel, (custom) => custom.resume, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  customs: CustomModel[];

  @OneToMany(() => OrderModel, (blockOrder) => blockOrder.resume, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  blockOrders: OrderModel[];
}
