import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import {
  ChatRequestDto,
  Message,
  CreateChatMessagesDto,
  GetChatMessagesDto,
} from './dto/chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Knowledge } from '../knowledges/entities/knowledge.entity';
import { Bot } from '../bots/entities/bot.entity';
import { ChatRecord } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(ChatRecord)
    private readonly chatRecordRepository: Repository<ChatRecord>,

    @InjectRepository(Knowledge)
    private readonly knowledgesRepository: Repository<Knowledge>,

    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
  ) {}

  async streamChat(
    chatRequest: ChatRequestDto,
    response: Response,
  ): Promise<void> {
    try {
      // 设置 SSE 头
      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');
      response.setHeader('Access-Control-Allow-Origin', '*');

      const headers = {
        'Content-Type': 'application/json',
      };

      let apiBase = chatRequest.apiBase;
      let apiKey = chatRequest.apiKey;
      let model = chatRequest.model;
      let temperature = chatRequest.temperature;
      let maxToken = chatRequest.maxToken;
      let top_p = chatRequest.top_p;
      let capabilities = chatRequest.capabilities;

      // 如果携带了botId，查询Bot的模型配置信息
      if (chatRequest.botId) {
        const bot = await this.botRepository.findOne({
          where: { botId: chatRequest.botId },
        });
        if (bot && bot.chatSetting) {
          apiBase = bot.chatSetting.apiBase;
          apiKey = bot.chatSetting.apiKey;
          model = bot.chatSetting.apiModelName;
          temperature = bot.chatSetting.temperature;
          maxToken = bot.chatSetting.maxToken;
          top_p = bot.chatSetting.top_P;
          capabilities = bot.chatSetting.capabilities;
        }
      }

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // 构建消息数组
      let messages: Array<Message> = [];

      // 添加系统提示（如果有）
      if (chatRequest.systemPrompt) {
        messages.push({
          role: 'system',
          content: chatRequest.systemPrompt,
        });
      }

      // 添加历史消息（如果有）
      if (chatRequest.historyMessages?.length) {
        const startIndex = chatRequest.context
          ? Math.max(
              0,
              chatRequest.historyMessages.length - chatRequest.context,
            )
          : 0;
        messages = messages.concat(
          chatRequest.historyMessages.slice(startIndex),
        );
      }

      // 添加当前用户消息
      messages.push({
        role: 'user',
        content: chatRequest.question,
      });

      const data = {
        model,
        messages,
        stream: chatRequest.stream,
        temperature,
        max_tokens: maxToken,
        top_p,
        ...capabilities,
      };

      try {
        const axiosResponse = await firstValueFrom(
          this.httpService.post(apiBase, data, {
            headers,
            responseType: 'stream',
          }),
        );

        // 处理流式响应
        axiosResponse.data.on('data', (chunk: Buffer) => {
          const lines = chunk
            .toString()
            .split('\n')
            .filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.includes('[DONE]')) {
              response.write('data: [DONE]\n\n');
              return;
            }

            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.slice(6));
                const content = jsonData.choices?.[0]?.delta?.content || '';
                if (content) {
                  response.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch (e) {
                response.write(
                  `data: ${JSON.stringify({
                    error: '解析响应数据出错',
                    details: e.message,
                  })}\n\n`,
                );
              }
            }
          }
        });

        // 处理结束
        axiosResponse.data.on('end', () => {
          response.end();
        });

        // 处理错误
        axiosResponse.data.on('error', (err) => {
          response.write(
            `data: ${JSON.stringify({
              error: '流处理错误',
              details: err.message,
            })}\n\n`,
          );
          response.end();
        });
      } catch (error) {
        response.write(
          `data: ${JSON.stringify({
            error: 'API 请求错误',
            details: error.message,
          })}\n\n`,
        );
        response.end();
      }
    } catch (error) {
      response.write(
        `data: ${JSON.stringify({
          error: '服务器错误',
          details: error.message,
        })}\n\n`,
      );
      response.end();
    }
  }
  async saveChatRecords(createChatMessages: CreateChatMessagesDto) {
    const { kbId, username, messages } = createChatMessages;

    // 查找知识库
    const knowledge = await this.knowledgesRepository.findOneBy({ kbId });
    if (!knowledge) {
      return { code: 404, message: '知识库不存在' };
    }

    // 查找现有记录（按最新会话）
    let record = await this.chatRecordRepository.findOne({
      where: { kbId, username },
      order: { id: 'DESC' }, // 获取最新记录
    });

    // 存在则追加，不存在则创建
    if (record) {
      // 合并消息（避免重复）
      const existingMessages = record.messages || [];
      const newMessages = messages.filter(
        (newMsg) =>
          !existingMessages.some(
            (existMsg) => existMsg.question === newMsg.question,
          ),
      );

      record.messages = [...existingMessages, ...newMessages];
      record = await this.chatRecordRepository.save(record);
    } else {
      record = await this.chatRecordRepository.save({
        kbId,
        username,
        messages,
      });
    }

    return {
      code: 200,
      message: '保存成功',
    };
  }

  async getChatRecords(getChatMessages: GetChatMessagesDto) {
    const { kbId, username } = getChatMessages;

    const recordList = await this.chatRecordRepository.find({
      where: { kbId, username },
      order: { id: 'DESC' },
    });
    return {
      code: 200,
      message: '获取成功',
      data: {
        recordList: recordList.flatMap((record) => record.messages),
      },
      count: recordList.length || 0,
    };
  }
}
