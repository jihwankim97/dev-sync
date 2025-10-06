import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_profile')
export class ProfileModel extends BaseUuidModel {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true, name: 'github_url' })
  githubUrl: string;

  @Column({ nullable: true, name: 'blog_url' })
  blogUrl: string;

  @OneToOne(() => ResumeModel, (resume) => resume.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resume: ResumeModel;
}
