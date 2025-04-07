export class CreateKnowledgeDto {
  kbName: string;
  type: 'quick' | 'faq' | 'normal';
  username: string;
}

export class UpdateKnowledgeDto {
  kbId: string;
  kbName: string;
}

export class GetKnowledgeDto {
  kbId: string;
  type: 'quick' | 'faq' | 'normal';
}

export class DeleteKnowledgeDto {
  kbId: string;
}

export class GetKnowledgeListDto {
  username: string;
  type: 'quick' | 'faq' | 'normal';
}
