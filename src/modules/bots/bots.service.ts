import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Bot } from './entities/bot.entity';
import {
  CreateBotDto,
  GetBotInfoDto,
  GetBotListDto,
  UpdateBotInfoDto,
  DeleteBotDto,
  GetBotCountByDateDto,
} from './dto/bots.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
  ) {}

  async createBot(
    file: Express.Multer.File,
    createBot: CreateBotDto,
  ): Promise<any> {
    const bot = this.botRepository.create({
      botId: randomBytes(16).toString('hex'),
      avatar: `/avatars/${file.filename}`,
      kbIds: [],
      welcomeMessage: '',
      roleSetting: '',
      chatSetting: {},
      createTime: new Date().toISOString(),
      ...createBot,
    });
    await this.botRepository.save(bot);
    return {
      code: 200,
      message: 'Bot创建成功',
      data: bot,
    };
  }

  async getBotInfo(getBotInfoDto: GetBotInfoDto) {
    const { botId } = getBotInfoDto;
    const botInfo = await this.botRepository.findOne({
      where: { botId },
    });
    if (!botInfo) {
      return {
        code: 404,
        message: 'Bot不存在',
      };
    }
    return {
      code: 200,
      data: botInfo,
    };
  }
  async getBotList(getBotListDto: GetBotListDto) {
    const { username } = getBotListDto;
    const bots = await this.botRepository.find({
      where: { username },
    });
    return {
      code: 200,
      data: bots,
    };
  }

  async updateBotInfo(updateBotInfoDto: UpdateBotInfoDto) {
    const {
      botId,
      botName,
      introduction,
      avatar,
      kbIds,
      welcomeMessage,
      roleSetting,
      chatSetting,
    } = updateBotInfoDto;
    const bot = await this.botRepository.findOne({
      where: { botId },
    });
    if (!bot) {
      throw new NotFoundException({
        code: 404,
        message: 'Bot不存在',
      });
    }

    bot.botName = botName;
    bot.introduction = introduction;
    bot.avatar = avatar;
    bot.kbIds = kbIds;
    bot.welcomeMessage = welcomeMessage;
    bot.roleSetting = roleSetting;
    bot.chatSetting = chatSetting;

    await this.botRepository.save(bot);

    return {
      code: 200,
      message: 'Bot更新成功',
      data: bot,
    };
  }

  async deleteBot(deleteBotDto: DeleteBotDto) {
    const { botId } = deleteBotDto;
    const bot = await this.botRepository.findOne({
      where: { botId },
    });
    if (!bot) {
      throw new NotFoundException({
        code: 404,
        message: 'Bot不存在',
      });
    }

    await this.botRepository.remove(bot);
    return {
      code: 200,
      message: 'Bot删除成功',
    };
  }

  async getBotCountByDate(getBotCountByDateDto: GetBotCountByDateDto) {
    const { role, date } = getBotCountByDateDto;
    if (role === 'admin') {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - date);

      const files = await this.botRepository.find({
        where: {
          createTime: MoreThanOrEqual(startDate.toISOString()),
        },
      });

      const dateCountMap = new Map<string, number>();
      files.forEach((file) => {
        const date = new Date(file.createTime).toISOString().split('T')[0]; // 获取日期部分
        if (dateCountMap.has(date)) {
          dateCountMap.set(date, dateCountMap.get(date) ?? 0 + 1);
        } else {
          dateCountMap.set(date, 1);
        }
      });

      // 转换为指定格式
      const result = Array.from(dateCountMap).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        code: 200,
        message: '获取bot数量成功',
        data: result,
      };
    }

    return {
      code: 403,
      message: '无权访问bot统计信息',
    };
  }
}
