import {
  Controller,
  Get,
  Request,
  Response,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import {
  AuthenticatedGuard,
  GithubAuthGuard,
  GoogleAuthGuard,
} from './auth.guard';
import { AuthExceptionFilter } from './auth-exception.filter';
import { User } from 'src/user/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('status')
  getAuthStatus(@User() user) {
    return user?.email;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(AuthExceptionFilter)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(AuthExceptionFilter)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user } = req;
    if (user) {
      return res.redirect('http://localhost:4000/');
    } else {
      return res.status(403).send('로그인에 실패했습니다.');
    }
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  @UseFilters(AuthExceptionFilter)
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @UseFilters(AuthExceptionFilter)
  async githubAuthRedirect(@Request() req, @Response() res) {
    const { user } = req;
    if (user) {
      return res.redirect('http://localhost:4000/');
    } else {
      return res.status(403).send('로그인에 실패했습니다.');
    }
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Request() req, @Response() res) {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: '로그아웃에 실패했습니다.', error: err.message });
      }
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: '세션 삭제에 실패했습니다.', error: err.message });
        }
        res.clearCookie('connect.sid', { path: '/' });
        return res.status(200).json({ message: '로그아웃에 성공했습니다.' });
      });
    });
  }
}
