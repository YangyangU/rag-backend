import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Knowledge } from './entities/knowledge.entity';
import { KnowledgeService } from './knowledges.service';
import { KnowledgeController } from './knowledges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge])],
  providers: [KnowledgeService],
  controllers: [KnowledgeController],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
