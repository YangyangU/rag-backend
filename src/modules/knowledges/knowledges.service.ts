import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Knowledge } from './entities/knowledge.entity';
import {
  CreateKnowledgeDto,
  UpdateKnowledgeDto,
  DeleteKnowledgeDto,
  GetKnowledgeDto,
  GetKnowledgeListDto,
} from './dto/knowledges.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private knowledgesRepository: Repository<Knowledge>,
  ) {}

  async createKnowledge(createKnowledgeDto: CreateKnowledgeDto): Promise<any> {
    const { kbId, kbName, type } = createKnowledgeDto;

    // 检查用户名是否已存在
    const existingKnowledge = await this.knowledgesRepository.findOne({
      where: { kbId },
    });
    if (existingKnowledge) {
      throw new ConflictException('知识库已存在');
    }

    const knowledge = this.knowledgesRepository.create({
      kbId,
      kbName,
      type,
    });
    await this.knowledgesRepository.save(knowledge);
    return { message: '创建成功' };
  }

  async updateKnowledge(updateKnowledgeDto: UpdateKnowledgeDto): Promise<any> {
    const { kbId, kbName } = updateKnowledgeDto;
    const knowledge = await this.knowledgesRepository.findOne({
      where: { kbId },
    });

    if (!knowledge) {
      throw new UnauthorizedException('知识库不存在');
    }

    await this.knowledgesRepository.update(kbId, { kbName });
    return { message: '修改成功' };
  }

  async deleteKnowledge(deleteKnowledgeDto: DeleteKnowledgeDto): Promise<any> {
    const { kbId } = deleteKnowledgeDto;
    const knowledge = await this.knowledgesRepository.findOne({
      where: { kbId },
    });

    if (!knowledge) {
      throw new UnauthorizedException('知识库不存在');
    }

    await this.knowledgesRepository.delete(kbId);
    return { message: '删除成功' };
  }

  async getKnowledge(getKnowledgeDto: GetKnowledgeDto): Promise<any> {
    const { kbId, type } = getKnowledgeDto;
    const knowledge = await this.knowledgesRepository.findOne({
      where: { kbId, type },
    });

    if (!knowledge) {
      throw new UnauthorizedException('知识库不存在');
    }

    return knowledge;
  }

  async getKnowledgeList(
    getKnowledgeListDto: GetKnowledgeListDto,
  ): Promise<any> {
    const { username, type } = getKnowledgeListDto;
    const knowledge = await this.knowledgesRepository.find({
      where: { username, type },
    });

    if (!knowledge) {
      throw new UnauthorizedException('知识库不存在');
    }
  }
}
