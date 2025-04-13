import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { Bot } from './entities/bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bot])],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotModule {}
