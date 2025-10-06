import { BaseModel } from 'src/common/entity/base.entity';
import { Post } from 'src/post/entities/post.entity';
import { ResumeModel } from 'src/resume/entities/resume.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseModel {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true, name: 'birth_date' })
  birthDate: Date;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: number;

  @Column({ nullable: true, name: 'profile_image' })
  profileImage: string;

  @Column({ nullable: true, name: 'github_url' })
  githubUrl: string;

  @Column({ nullable: true, name: 'blog_url' })
  blogUrl: string;

  @Column({ nullable: true, name: 'education_level' })
  educationLevel: string;

  @Column({ nullable: true, name: 'university_name' })
  universityName: string;

  @Column({ nullable: true, name: 'department_name' })
  departmentName: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => ResumeModel, (resume) => resume.author)
  resumes: ResumeModel[];
}
