export class CreateKnowledgeDto {
  kbName: string;
  type: 'quick' | 'normal';
  username: string;
}

export class UpdateKnowledgeDto {
  kbId: string;
  kbName: string;
}

export class GetKnowledgeDto {
  kbId: string;
  type: 'quick' | 'normal';
}

export class DeleteKnowledgeDto {
  kbIds: [string];
}

export class GetKnowledgeListDto {
  username: string;
  type: 'quick' | 'normal';
}
