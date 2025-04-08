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

export interface ChatMessage {
  type: 'ai' | 'user'; //区别用户提问 和ai回复
  question?: string; //问题
  answer?: string; //问题 | 回复内容
  like?: boolean; //点赞
  unlike?: boolean; //点踩
  copied?: boolean;
  showTools?: boolean; //当期问答是否结束 结束展示复制等小工具和取消闪烁
  picList?: any;
}

export class CreateChatMessagesDto {
  username: string;
  kbId: string;
  messages: ChatMessage[];
}

export class GetChatMessagesDto {
  username?: string;
  kbId?: string;
}
