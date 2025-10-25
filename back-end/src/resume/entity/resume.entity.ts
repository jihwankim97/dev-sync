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
  UpdateDateColumn,
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

  @ManyToOne(() => User, (user) => user.resumes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToOne(() => IntroductionModel, (introduction) => introduction.resume)
  introduction: IntroductionModel;

  @OneToOne(() => ProfileModel, (profile) => profile.resume)
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

  @OneToMany(() => ProjectModel, (project) => project.resume)
  projects: ProjectModel[];

  @OneToMany(() => CareerModel, (career) => career.resume)
  careers: CareerModel[];

  @OneToMany(() => AchievementModel, (achievement) => achievement.resume)
  achievements: AchievementModel[];

  @OneToMany(() => CustomModel, (custom) => custom.resume)
  customs: CustomModel[];

  @OneToMany(() => OrderModel, (blockOrder) => blockOrder.resume)
  blockOrders: OrderModel[];

  @UpdateDateColumn()
  updatedAt: Date;
}
