export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
export class ChatRequestDto {
  question: string;
  apiKey: string;
  apiBase: string;
  model?: string;
  temperature?: number;
  maxToken?: number;
  systemPrompt?: string;
  historyMessages?: Message[]; // 历史消息数组
  maxContextLength?: number;
}
