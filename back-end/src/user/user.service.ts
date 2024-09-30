import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //createUser
  createUser(user): Promise<User> {
    return this.userRepository.save(user);
  }

  //select one user
  async getUser(email: string) {
    const result = await this.userRepository.findOne({ where: { email } });
    return result;
  }

  async updateUser(email, _user) {
    const user: User = await this.getUser(email);
    console.log('param', _user);
    user.username = _user.username;
    user.password = _user.password;
    console.log('result', user);
    this.userRepository.save(user);
  }

  //delete userInfo
  deleteUser(email: any) {
    return this.userRepository.delete({ email });
  }
}
