import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn()
    comment_id:number;

    @Column({type:'text', nullable:false})
    comment:string;

    @ManyToOne(()=>User, {nullable:false})
    @JoinColumn({name:'user_id'})
    user_id:User;

    @ManyToOne(()=>Post, {nullable:false, onDelete:'CASCADE'})
    @JoinColumn({name:'post_id'})
    post:Post;

    @ManyToOne(()=>Comment, {nullable:true, onDelete:'CASCADE'})
    parent:Comment;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}