export class GetBotInfoDto {
  botId: string;
}

export class GetBotListDto {
  username: string;
}

export class CreateBotDto {
  botName: string;
  introduction: string;
}

export class UpdateBotInfoDto {
  botId: string;
  botName: string;
  introduction: string;
  avatar: string;
  kbIds: string[];
}

export class DeleteBotDto {
  botId: string;
}
