import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Provider } from 'src/user/entity/user.entity';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class GithubStrategy extends PassportStrategy(GitHubStrategy, 'github') {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException(
        'GitHub 계정에서 이메일 정보를 가져올 수 없습니다.',
      );
    }

    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    const encryptedToken = accessToken
      ? CryptoJS.AES.encrypt(accessToken, encryptionKey).toString()
      : null;

    let user: User = await this.userService.findByEmail(email);
    if (!user) {
      const fallbackName =
        profile.displayName ||
        profile.username ||
        `${profile.name?.familyName ?? ''}${profile.name?.givenName ?? ''}` ||
        'GitHub User';

      user = await this.userService.findByEmailOrSave(
        email,
        fallbackName,
        Provider.GITHUB,
        encryptedToken,
      );
    } else {
      if (encryptedToken) {
        await this.userService.update(email, {
          githubAccessToken: encryptedToken,
        });
        user = await this.userService.findByEmail(email);
      }
    }

    return user;
  }
}
