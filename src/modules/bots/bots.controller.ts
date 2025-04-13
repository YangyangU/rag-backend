import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import {
  CreateBotDto,
  GetBotInfoDto,
  GetBotListDto,
  UpdateBotInfoDto,
  DeleteBotDto,
} from './dto/bots.dto';
import { avatarMulterConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post('createBot')
  @UseInterceptors(FileInterceptor('file', avatarMulterConfig))
  async createBot(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBot: CreateBotDto,
  ) {
    return await this.botsService.createBot(file, createBot);
  }

  @Get('getBotInfo')
  async getBotInfo(@Query() getBotInfoDto: GetBotInfoDto) {
    return await this.botsService.getBotInfo(getBotInfoDto);
  }

  @Get('getBotList')
  async getBotList(@Query() getBotListDto: GetBotListDto) {
    return await this.botsService.getBotList(getBotListDto);
  }

  @Post('updateBot')
  async updateBotInfo(@Body() updateBotInfoDto: UpdateBotInfoDto) {
    return await this.botsService.updateBotInfo(updateBotInfoDto);
  }

  @Post('deleteBot')
  async deleteBot(@Body() deleteBotDto: DeleteBotDto) {
    return await this.botsService.deleteBot(deleteBotDto);
  }
}
