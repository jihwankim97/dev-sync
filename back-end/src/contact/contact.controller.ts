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

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitInquiry(@Body() contact: CreateContactDto): Promise<string> {
    return this.contactService.sendInquiryEmail(contact);
  }

  @Get()
  async getContacts(@Query('email') email?: string) {
    return this.contactService.getContactListByEmail(email);
  }

  @Get(':id')
  async getContactById(
    @Param('id') id: number,
    @Query('password') password?: string,
  ) {
    return this.contactService.getContactById(id, password);
  }

  @Patch(':id')
  async updateContact(@Param('id') id: number, @Body() dto: UpdateContactDto) {
    return this.contactService.updateContact(id, dto);
  }

  @Delete(':id')
  async deleteContact(
    @Param('id') id: number,
    @Query('password') password?: string,
  ) {
    return this.contactService.deleteContact(id, password);
  }
}
