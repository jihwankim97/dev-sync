import { User } from 'src/user/entity/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Post } from './post.entity';

@Entity()
@Unique(['user', 'post'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  post: Post;
}
