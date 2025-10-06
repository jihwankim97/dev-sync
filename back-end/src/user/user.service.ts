import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // 사용자 조회
  async getUser(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(user_id: number) {
    return await this.userRepository.findOne({ where: { id: user_id } });
  }

  // 사용자 업데이트 (프로필 이미지 포함)
  async updateUser(updateUserDto: Partial<UpdateUserDto>) {
    const email = updateUserDto.email;

    if (!email) {
      throw new HttpException('이메일이 필요합니다.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const { profileImage, ...restDto } = updateUserDto;
    user.profileImage = profileImage;
    Object.assign(user, restDto);

    return this.userRepository.save(user);
  }

  async updateProfile(email: string, file?: Express.Multer.File) {
    if (!email) {
      throw new HttpException('이메일이 필요합니다.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // 파일이 있는 경우에만 프로필 이미지 URL 업데이트
    if (file) {
      const uniqueFilename = `${uuidv4()}.png`;
      const newPath = `./uploads/${uniqueFilename}`;

      if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
      }

      if (file.buffer) {
        // 버퍼로 파일을 저장하고 새로운 이미지 URL 설정
        fs.writeFileSync(newPath, file.buffer as any);
        user.profileImage = `http://localhost:3000/uploads/${uniqueFilename}`;
      } else {
        console.error('파일 버퍼가 존재하지 않습니다.');
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

  // 이메일로 사용자 조회 후 없으면 저장
  async findByEmailOrSave(email, name) {
    const foundUser = await this.getUser(email);
    if (foundUser) {
      return foundUser;
    }
    const newUser = this.userRepository.create({
      email,
      name,
    });
    return this.userRepository.save(newUser);
  }

  // 사용자 삭제
  async deleteUser(email: any) {
    return await this.userRepository.delete({ email });
  }
}
