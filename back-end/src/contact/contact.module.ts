import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entity/contact.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), CommonModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
