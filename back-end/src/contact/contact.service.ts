import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entity/contact.entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly configService: ConfigService,
  ) {}

  async sendInquiryEmail(dto: CreateContactDto): Promise<string> {
    const newContact = this.createContact(dto);

    if (!newContact) {
      throw new Error('Failed to create contact record');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('ADMIN_EMAIL_MK'),
        pass: this.configService.get<string>('ADMIN_APP_PASS_MK'),
      },
    });

    // 이메일 옵션
    const mailOptions = {
      from: `"Contact Manager System" <${this.configService.get<string>('ADMIN_EMAIL_MK')}>`,
      to: this.configService.get<string>('ADMIN_EMAIL_MK'),
      subject: `New Inquiry from ${dto.name}: ${dto.title}`,
      text: `
        Name: ${dto.name}
        Email: ${dto.email}
        Subject: ${dto.title}
        Message: ${dto.content}
      `,
    };

    // 이메일 전송
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return `Email sent successfully: ${info.messageId}`;
    } catch (error) {
      console.error('Failed to send email:', error.message || error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async createContact(dto: CreateContactDto) {
    const hashPwd = dto.password
      ? await bcrypt.hash(
          dto.password,
          parseInt(this.configService.get<string>('HASH_ROUNDS')),
        )
      : null;

    const contact = this.contactRepository.create({
      ...dto,
      password: hashPwd,
    });

    return await this.contactRepository.save(contact);
  }

  async getContacts() {
    return await this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getContactListByEmail(user_email?: string) {
    const contacts = await this.contactRepository.find({
      where: user_email ? { email: user_email } : {},
      select: ['id', 'name', 'title', 'createdAt', 'password'],
      order: { createdAt: 'DESC' },
    });

    if (!contacts.length) {
      throw new NotFoundException('해당 이메일로 작성된 문의글이 없습니다.');
    }

    return contacts.map((c) =>
      c.password
        ? {
            isPrivate: true,
          }
        : {
            id: c.id,
            name: c.name,
            title: c.title,
            createdAt: c.createdAt,
            isPrivate: false,
          },
    );
  }

  async getContactById(id: number, password?: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('해당 문의글을 찾을 수 없습니다.');
    }

    const isPrivate = !!contact.password;

    if (isPrivate) {
      if (!password) throw new UnauthorizedException('비밀번호가 필요합니다.');

      const isMatch = await bcrypt.compare(password, contact.password);
      if (!isMatch)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return contact;
  }

  async updateContact(id: number, dto: UpdateContactDto) {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('문의글을 찾을 수 없습니다.');
    }

    const isPrivate = !!contact.password;

    if (isPrivate) {
      const isMatch = await bcrypt.compare(dto.password, contact.password);
      if (!isMatch)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const updated = this.contactRepository.merge(contact, dto);
    return await this.contactRepository.save(updated);
  }

  async deleteContact(id: number, password?: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('문의글을 찾을 수 없습니다.');
    }

    const isPrivate = !!contact.password;

    if (isPrivate) {
      if (!password) throw new UnauthorizedException('비밀번호가 필요합니다.');

      const isMatch = password === contact.password;
      if (!isMatch)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    await this.contactRepository.delete(id);
    return { message: '문의글이 삭제되었습니다.' };
  }
}
