export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
export class ChatRequestDto {
  message: string;
  apiKey: string;
  apiUrl: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  historyMessages?: Message[]; // 历史消息数组
  maxContextLength?: number;
}
