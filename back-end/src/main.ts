import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.use(cookieParser());
  app.use(
    session({
      secret: 'very-important-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 604800000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.enableCors({
    origin: 'http://localhost:4000', // 클라이언트 도메인을 React의 포트인 4000번으로 설정
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메서드 명시
    credentials: true, // 쿠키를 포함한 요청 허용
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더 명시
  });

  await app.listen(3000); // 서버를 3000번 포트로 변경
}
bootstrap();
