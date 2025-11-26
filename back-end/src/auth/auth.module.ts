import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';

import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [UserModule, PassportModule.register({ session: true })],
  providers: [SessionSerializer, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
