import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt: Date;

  @VersionColumn()
  @Exclude()
  version: number;
}

export abstract class BaseUuidModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @CreateDateColumn()
  // @Exclude()
  // createdAt: Date;

  // @UpdateDateColumn()
  // @Exclude()
  // updatedAt: Date;

  // @VersionColumn()
  // @Exclude()
  // version: number;
}
