import {
    Column,
    Entity,
    ManyToOne,
  } from 'typeorm';
  import { ResumeModel } from './resume.entity';
  import {BaseUuidModel } from 'src/common/entity/base.entity';
  
  @Entity()
  export class CareerModel extends BaseUuidModel {
  
    @Column()
    company: string;
  
    @Column()
    position: string;
  
    @Column()
    start_date: Date;
  
    @Column({ nullable: true })
    end_date: Date;
  
    @Column()
    description: string;
  
    @ManyToOne(() => ResumeModel, (resume) => resume.careers)
    resume: ResumeModel;
  }