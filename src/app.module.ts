import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './database/database.providers';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
