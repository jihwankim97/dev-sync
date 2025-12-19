import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ResumeModel } from './resume.entity';
import { IsString } from 'class-validator';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity('resume_introduction')
export class IntroductionModel extends BaseUuidModel {
  @Column()
  @IsString()
  headline: string;

  @Column({ length: 500 })
  @IsString()
  description: string;

  @OneToOne(() => ResumeModel, (resume) => resume.introduction, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resume: ResumeModel;
}
