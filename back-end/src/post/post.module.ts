import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostService } from './post.service';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { Post } from './entity/post.entity';
import { Category } from './entity/category.entity';
import { Like } from './entity/like.entity';
import { Comment } from './entity/comment.entity';
import { UploadModule } from 'src/upload/upload.module';
import { CommonModule } from 'src/common/common.module';
import { PostOwnershipGuard } from './guard/post-ownership.guard';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, User, Like, Comment]),
    UserModule,
    CommonModule,
    UploadModule,
    CacheModule,
  ],
  controllers: [PostsController],
  providers: [PostService, CategoryService, PostOwnershipGuard],
  exports: [PostService],
})
export class PostsModule {}
