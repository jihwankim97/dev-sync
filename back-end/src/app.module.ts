import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { ContactModule } from './contact/contact.module';
import { PostsModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { User } from './user/entity/user.entity';
import { Post } from './post/entity/post.entity';
import { Category } from './post/entity/category.entity';
import { Like } from './post/entity/like.entity';
import { Comment } from './post/entity/comment.entity';
import { CommonModule } from './common/common.module';
import { BaseModel } from './common/entity/base.entity';
import { IntroductionModel } from './resume/entity/introduction.entity';
import { ProjectModel } from './resume/entity/project.entity';
import { SkillModel } from './resume/entity/skill.entity';
import { ResumeModel } from './resume/entity/resume.entity';
import { ProjectOutcomeModel } from './resume/entity/project-outcome.entity';
import { Contact } from './contact/entity/contact.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { ProfileModel } from './resume/entity/profile.entity';
import { CareerModel } from './resume/entity/career.entity';
import { AchievementModel } from './resume/entity/achievement.entity';
import { CustomModel } from './resume/entity/custom.entity';
import { OrderModel } from './resume/entity/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev', 'prod').required(),
        DB_TYPE: Joi.string().valid('mysql').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        entities: [
          User,
          Post,
          Category,
          Like,
          Comment,
          BaseModel,
          IntroductionModel,
          ProjectModel,
          SkillModel,
          ResumeModel,
          ProjectOutcomeModel,
          Contact,
          ProfileModel,
          CareerModel,
          AchievementModel,
          CustomModel,
          OrderModel,
        ],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ResumeModule,
    ContactModule,
    PostsModule,
    UploadModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
