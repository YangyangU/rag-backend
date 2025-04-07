import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { ChatRequestDto, Message } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly httpService: HttpService) {}

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
        Authorization: `Bearer ${chatRequest.apiKey}`,
      };

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
        const startIndex = chatRequest.maxContextLength
          ? Math.max(
              0,
              chatRequest.historyMessages.length - chatRequest.maxContextLength,
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
        model: chatRequest.model,
        messages,
        stream: true,
        temperature: chatRequest.temperature,
        max_tokens: chatRequest.maxToken,
      };

      try {
        const axiosResponse = await firstValueFrom(
          this.httpService.post(chatRequest.apiBase, data, {
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
}
