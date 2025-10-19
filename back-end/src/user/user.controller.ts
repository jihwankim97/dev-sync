import {
  Controller,
  Body,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { User } from './decorator/user.decorator';
import { AuthenticatedGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser(@User() user) {
    return this.userService.findByEmail(user.email);
  }

  @Post('profile')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateProfile(@User() user, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfile(user.email, file);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  updateUser(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.email, updateUserDto);
  }
}
