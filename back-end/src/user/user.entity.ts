import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  username: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date;

  @Column({ nullable: true, unique: true })
  providerId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  blogUrl: string;
}
