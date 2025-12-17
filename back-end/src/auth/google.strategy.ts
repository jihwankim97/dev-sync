import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Provider, User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile', 'openid'],
      accessType: 'offline',
      prompt: 'consent',
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails } = profile;

    const email = emails[0].value;
    let user: User = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.findByEmailOrSave(
        email,
        name.familyName + name.givenName,
        Provider.GOOGLE,
      );
    }
    return user;
  }
}
