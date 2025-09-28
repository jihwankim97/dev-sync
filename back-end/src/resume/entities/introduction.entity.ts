import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ResumeModel } from './resume.entity';
import { IsString } from 'class-validator';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity()
export class IntroductionModel extends BaseUuidModel {


  @Column()
  @IsString()
  headline: string;

  @Column()
  @IsString()
  description: string;

  @OneToOne(() => ResumeModel, (resume) => resume.introduction)
  @JoinColumn()
  resume: ResumeModel;
}
