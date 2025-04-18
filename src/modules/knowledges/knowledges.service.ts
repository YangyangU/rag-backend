import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Knowledge } from './entities/knowledge.entity';
import {
  CreateKnowledgeDto,
  UpdateKnowledgeDto,
  DeleteKnowledgeDto,
  GetKnowledgeDto,
  GetKnowledgeListDto,
} from './dto/knowledges.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private knowledgesRepository: Repository<Knowledge>,
  ) {}

  async createKnowledge(createKnowledgeDto: CreateKnowledgeDto): Promise<any> {
    const { kbName, type, username } = createKnowledgeDto;

    const kbId = randomBytes(16).toString('hex');
    const createTime = new Date().toISOString();

    // 检查用户名是否已存在
    const existingKnowledge = await this.knowledgesRepository.findOne({
      where: { kbId },
    });
    if (existingKnowledge) {
      throw new ConflictException({
        code: 409,
        message: '知识库已存在',
      });
    }

    const knowledge = this.knowledgesRepository.create({
      kbId,
      kbName,
      type,
      createTime,
      username,
    });
    await this.knowledgesRepository.save(knowledge);
    return {
      code: 200,
      message: '创建成功',
      data: knowledge,
    };
  }

  async updateKnowledge(updateKnowledgeDto: UpdateKnowledgeDto): Promise<any> {
    const { kbId, kbName } = updateKnowledgeDto;
    const knowledge = await this.knowledgesRepository.findOne({
      where: { kbId },
    });

    if (!knowledge) {
      throw new UnauthorizedException({
        code: 401,
        message: '知识库不存在',
      });
    }

    await this.knowledgesRepository.update(kbId, { kbName });
    return {
      code: 200,
      message: '修改成功',
    };
  }

  async deleteKnowledge(deleteKnowledgeDto: DeleteKnowledgeDto): Promise<any> {
    const { kbIds } = deleteKnowledgeDto;

    const existingCount = await this.knowledgesRepository.count({
      where: { kbId: In(kbIds) },
    });

    if (existingCount !== kbIds.length) {
      throw new NotFoundException({
        code: 404,
        message: '部分知识库不存在',
        details: `请求删除 ${kbIds.length} 条，实际找到 ${existingCount} 条`,
      });
    }
    await this.knowledgesRepository.manager.transaction(async (manager) => {
      await manager.delete(Knowledge, { kbId: In(kbIds) });
    });

    return {
      code: 200,
      message: '删除成功',
    };
  }

  async getKnowledge(getKnowledgeDto: GetKnowledgeDto): Promise<any> {
    const { kbId, type } = getKnowledgeDto;
    const knowledge = await this.knowledgesRepository.findOne({
      where: { kbId, type },
    });

    if (!knowledge) {
      throw new UnauthorizedException({
        code: 401,
        message: '知识库不存在',
      });
    }

    return {
      code: 200,
      message: '查询成功',
      data: knowledge,
    };
  }

  async getKnowledgeList(
    getKnowledgeListDto: GetKnowledgeListDto,
  ): Promise<any> {
    const { username, type } = getKnowledgeListDto;
    const knowledgeList = await this.knowledgesRepository.find({
      where: { username, type },
    });

    return {
      code: 200,
      message: '查询成功',
      data: knowledgeList,
      count: knowledgeList.length,
    };
  }
}
