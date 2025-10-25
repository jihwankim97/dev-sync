import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class Comment extends BaseModel {
  @Column({ nullable: false })
  comment: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  author: User;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  parent: Comment;
}
