import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream')
  async streamChat(
    @Body() chatRequest: ChatRequestDto,
    @Res() response: Response,
  ): Promise<void> {
    try {
      await this.chatService.streamChat(chatRequest, response);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: '服务器错误',
        details: error.message,
      });
    }
  }
}
