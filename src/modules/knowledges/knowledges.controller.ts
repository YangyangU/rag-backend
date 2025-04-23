import { Controller, Post, Body } from '@nestjs/common';
import { KnowledgeService } from './knowledges.service';
import {
  CreateKnowledgeDto,
  UpdateKnowledgeDto,
  DeleteKnowledgeDto,
  GetKnowledgeDto,
  GetKnowledgeListDto,
  GetKbCountByDateDto,
} from './dto/knowledges.dto';

@Controller('knowledges')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('createKb')
  async createKnowledge(@Body() createKnowledgeDto: CreateKnowledgeDto) {
    return this.knowledgeService.createKnowledge(createKnowledgeDto);
  }

  @Post('updateKb')
  async updateKnowledge(@Body() updateKnowledgeDto: UpdateKnowledgeDto) {
    return this.knowledgeService.updateKnowledge(updateKnowledgeDto);
  }

  @Post('deleteKb')
  async deleteKnowledge(@Body() deleteKnowledgeDto: DeleteKnowledgeDto) {
    return this.knowledgeService.deleteKnowledge(deleteKnowledgeDto);
  }

  @Post('getKb')
  async getKnowledge(@Body() getKnowledgeDto: GetKnowledgeDto) {
    return this.knowledgeService.getKnowledge(getKnowledgeDto);
  }

  @Post('getKbList')
  async getKnowledgeList(@Body() getKnowledgeListDto: GetKnowledgeListDto) {
    return this.knowledgeService.getKnowledgeList(getKnowledgeListDto);
  }

  @Post('getKbCountByDate')
  async getKnowledgeCountByDate(
    @Body() getKbCountByDateDto: GetKbCountByDateDto,
  ) {
    return this.knowledgeService.getKnowledgeCountByDate(getKbCountByDateDto);
  }
}
