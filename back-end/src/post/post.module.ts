import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, User, Like, Comment]),
    UserModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CategoryService, UploadService],
})
export class PostsModule {}
