export class UploadFileDto {
  kbId: string;
}
export class GetFilesDto {
  kbId: string;
}

export class DeleteFilesDto {
  fileNames: string[];
}

export class GetFileBase64Dto {
  fileName: string;
}
