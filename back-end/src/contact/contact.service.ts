import {
  BadRequestException,
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
import { CommonService } from 'src/common/common.service';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  async sendInquiryEmail(dto: CreateContactDto): Promise<string> {
    const newContact = await this.create(dto);

    if (!newContact) {
      throw new BadRequestException('문의글 생성에 실패했습니다.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('ADMIN_EMAIL_MK'),
        pass: this.configService.get<string>('ADMIN_APP_PASS_MK'),
      },
    });

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

    try {
      const info = await transporter.sendMail(mailOptions);

      return `이메일이 성공적으로 전송되었습니다. ${info.messageId}`;
    } catch (error) {
      throw new BadRequestException(
        `이메일 전송에 실패했습니다: ${error.message}`,
      );
    }
  }

  async create(dto: CreateContactDto) {
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

    return this.contactRepository.save(contact);
  }

  async findAll() {
    return this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByEmail(email: string, paginationDto: BasePaginationDto = {}) {
    const query = this.contactRepository.createQueryBuilder('contact');

    query.where('contact.email = :email', { email });

    this.commonService.applyPagePaginationParamsToQb(
      query,
      paginationDto,
      'createdAt',
    );

    const [contacts, total] = await query.getManyAndCount();

    if (!contacts.length) {
      throw new NotFoundException('해당 이메일로 작성된 문의글이 없습니다.');
    }

    const data = contacts.map((c) => {
      const hasPassword = !!c.password;

      return hasPassword
        ? {
            id: c.id,
            isPrivate: true,
          }
        : {
            id: c.id,
            name: c.name,
            title: c.title,
            createdAt: c.createdAt,
            isPrivate: false,
          };
    });

    return {
      data,
      meta: {
        total,
        page: paginationDto.page || 1,
        take: paginationDto.take || 20,
        totalPages: Math.ceil(total / (paginationDto.take || 20)),
      },
    };
  }

  async findById(id: number, password?: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('해당 문의글을 찾을 수 없습니다.');
    }

    await this.validatePassword(contact, password);
    return contact;
  }

  async update(id: number, dto: UpdateContactDto) {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('문의글을 찾을 수 없습니다.');
    }

    await this.validatePassword(contact, dto.password);

    const updated = this.contactRepository.merge(contact, {
      title: dto.title,
      content: dto.content,
    });

    return this.contactRepository.save(updated);
  }

  async delete(id: number, password?: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('문의글을 찾을 수 없습니다.');
    }

    await this.validatePassword(contact, password);

    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('문의글을 찾을 수 없습니다.');
    }

    return { message: '문의글이 삭제되었습니다.' };
  }

  private async validatePassword(contact: Contact, password?: string) {
    if (!contact.password) return;

    if (!password) {
      throw new UnauthorizedException('비밀번호가 필요합니다.');
    }

    const isMatch = await bcrypt.compare(password, contact.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }
}
