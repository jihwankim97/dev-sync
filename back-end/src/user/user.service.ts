import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findOne(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  async update(email: string, updateUserDto: Partial<UpdateUserDto>) {
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

  async updateProfile(email: string, file?: Express.Multer.File) {
    const user = await this.findByEmail(email);

    if (file) {
      const uniqueFilename = `${uuidv4()}.png`;
      const newPath = `./uploads/${uniqueFilename}`;

      if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
      }

      if (file.buffer) {
        fs.writeFileSync(newPath, file.buffer as any);
        user.profileImage = `${this.configService.get('BASE_URL')}/uploads/${uniqueFilename}`;
      } else {
        throw new HttpException(
          '파일 전송 실패',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        '파일이 제공되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userRepository.save(user);
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

  async remove(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.remove(user);
    return { message: '사용자가 삭제되었습니다.', email: user.email };
  }
}
