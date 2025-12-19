import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.email);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, user: any) => void,
  ): Promise<any> {
    const user = await this.userService.findByEmail(payload);

    if (!user) {
      done(new Error('존재하지 않는 사용자입니다.'), null);
      return;
    }
    const { ...userInfo } = user;
    done(null, userInfo);
  }
}
