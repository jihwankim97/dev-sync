import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { ResumeModel } from './resume.entity';
import { BaseUuidModel } from 'src/common/entity/base.entity';

@Entity()
export class CustomModel extends BaseUuidModel {

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => ResumeModel, (resume) => resume.customs)
  resume: ResumeModel;
}