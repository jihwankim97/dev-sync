import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { Like } from './like.entity';

@Entity()
export class Post extends BaseModel {
  @Column({ length: 100 })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: User;

  @Column({ default: 0, name: 'view_count' })
  viewCount: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
