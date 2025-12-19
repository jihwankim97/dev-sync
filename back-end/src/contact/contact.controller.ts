import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitInquiry(@Body() contact: CreateContactDto): Promise<string> {
    return this.contactService.sendInquiryEmail(contact);
  }

  @Get('email/:email')
  async getContacts(
    @Param('email') email: string,
    @Query() dto: BasePaginationDto,
  ) {
    return this.contactService.findByEmail(email, dto);
  }

  @Get(':id')
  async getContactById(
    @Param('id') id: number,
    @Query('password') password?: string,
  ) {
    return this.contactService.findById(id, password);
  }

  @Patch(':id')
  async updateContact(@Param('id') id: number, @Body() dto: UpdateContactDto) {
    return this.contactService.update(id, dto);
  }

  @Delete(':id')
  async deleteContact(
    @Param('id') id: number,
    @Query('password') password?: string,
  ) {
    return this.contactService.delete(id, password);
  }
}
