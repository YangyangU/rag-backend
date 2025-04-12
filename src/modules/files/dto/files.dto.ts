export class UploadFileDto {
  kbId: string;
}
export class GetFilesDto {
  kbId: string;
}

export class DeleteFilesDto {
  fileNames: string[];
}

export class GetFileContentDto {
  fileName: string;
}
