export class CreateKnowledgeDto {
  kbId: string;
  kbName: string;
  type: string;
}

export class UpdateKnowledgeDto {
  kbId: string;
  kbName: string;
}

export class GetKnowledgeDto {
  kbId: string;
  type: string;
}

export class DeleteKnowledgeDto {
  kbId: string;
}

export class GetKnowledgeListDto {
  username: string;
  type: string;
}
