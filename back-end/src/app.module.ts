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
import { Post } from './post/entities/post.entity';
import { Category } from './post/entities/category.entity';
import { Like } from './post/entities/like.entity';
import { Comment } from './post/entities/comment.entity';
import { CommonModule } from './common/common.module';
import { BaseModel } from './common/entity/base.entity';
import { IntroductionModel } from './resume/entities/introduction.entity';
import { ProjectModel } from './resume/entities/project.entity';
import { SkillModel } from './resume/entities/skill.entity';
import { ResumeModel } from './resume/entities/resume.entity';
import { ProjectOutcomeModel } from './resume/entities/project-outcome.entity';
import { Contact } from './contact/entity/contact.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { ProfileModel } from './resume/entities/profile.entity';
import { CareerModel } from './resume/entities/career.entity';
import { AchievementModel } from './resume/entities/achievement.entity';
import { CustomModel } from './resume/entities/custom.entity';
import { OrderModel } from './resume/entities/order.entity';

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
