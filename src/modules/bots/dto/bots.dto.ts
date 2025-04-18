export class GetBotInfoDto {
  botId: string;
}

export class GetBotListDto {
  username: string;
}

export class CreateBotDto {
  botName: string;
  introduction: string;
  username: string;
}

export class UpdateBotInfoDto {
  botId: string;
  botName: string;
  introduction: string;
  avatar: string;
  kbIds: string[];
  welcomeMessage: string;
  roleSetting: string;
  chatSetting: IChatSetting;
}

export class DeleteBotDto {
  botId: string;
}

type ICapabilities = {
  /* 是否联网搜索 */
  networkSearch: boolean;
  /* 是否混合搜索 */
  mixedSearch: boolean;
  /* 是否仅检索 */
  onlySearch: boolean;
  /* 是否增强检索 */
  rerank: boolean;
};

// 聊天设置
export interface IChatSetting {
  /* 模型类型，string为自定义名称，不用传 */
  modelType: 'openAI' | 'ollama' | '自定义模型配置';
  /* 自定义模型id，如果不是自定义就没有，不用传 */
  customId?: number;
  /* 自定义的模型名称，只有自定义时候用 */
  modelName?: string;
  /* 秘钥，openAI用 */
  apiKey: string;
  /* api路径 */
  apiBase: string;
  /* 模型名称 */
  apiModelName: string;
  /* 上下文token数量 */
  apiContextLength: number;
  /* 上下文的消息数量上限条数，不用传 */
  context: number;
  /* 返回的最大token */
  maxToken: number;
  /* 切片的token数 */
  chunkSize: number;
  /* 联想与发散 0~1 */
  temperature: number;
  /* 检索增强相关性阈值，0~1 */
  rerankScoreThreshold: number;
  /* top_P 0~1 */
  top_P: number;
  /* 控制数据来源数量 1~100 */
  top_K: number;
  /* 模型能力 */
  capabilities: ICapabilities;
}
