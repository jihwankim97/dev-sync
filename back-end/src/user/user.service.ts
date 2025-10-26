import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { User as UserEntity } from 'src/user/entity/user.entity';
import { UploadService } from 'src/upload/upload.service';
import { extname } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,
  ) {}

  async findOne(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new HttpException(
        '업데이트할 데이터가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.userRepository.update({ email }, updateUserDto);

    if (result.affected === 0)
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    return this.userRepository.findOne({ where: { email } });
  }

  async updateProfile(user: UserEntity, file?: Express.Multer.File) {
    const uploadPath = './uploads/profiles';
    const filename = `${user.id}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;

    let fileUrl: string;
    try {
      fileUrl = await this.uploadService.uploadFile(file, uploadPath, filename);

      await this.userRepository.update(user.id, {
        profileImage: fileUrl,
      });

      return this.findOne(user.id);
    } catch (error) {
      await this.uploadService.deleteFile(fileUrl);
      throw error;
    }
  }

  async findByEmailOrSave(email: string, name: string): Promise<User> {
    await this.userRepository.upsert(
      { email, name },
      {
        conflictPaths: ['email'],
        skipUpdateIfNoValuesChanged: true,
      },
    );

    return this.userRepository.findOne({ where: { email } });
  }

  async remove(userId: number) {
    const result = await this.userRepository.delete(userId);

    if (result.affected === 0) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: '사용자가 삭제되었습니다.', userId: userId };
  }
}
