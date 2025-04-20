import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRecord } from '../chat/entities/chat.entity';
import { Knowledge } from '../knowledges/entities/knowledge.entity';
import { Bot } from '../bots/entities/bot.entity';
import { FileModule } from '../files/files.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 3,
    }),
    TypeOrmModule.forFeature([ChatRecord, Knowledge, Bot]),
    FileModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
