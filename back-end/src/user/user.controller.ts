import {
  Controller,
  Body,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { User } from './decorator/user.decorator';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { User as UserEntity } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser(@User() user: UserEntity) {
    return this.userService.findByEmail(user.email);
  }

  @Post('profile')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateProfile(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfile(user, file);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  updateUser(@User() user: UserEntity, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.email, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthenticatedGuard)
  deleteUser(@User() user: UserEntity) {
    return this.userService.remove(user.id);
  }
}
