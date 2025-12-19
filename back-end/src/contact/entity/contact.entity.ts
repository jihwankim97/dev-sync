import { Column, Entity } from 'typeorm';

import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class Contact extends BaseModel {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;
}
