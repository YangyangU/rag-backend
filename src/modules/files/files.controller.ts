import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  UploadFileDto,
  GetFilesDto,
  DeleteFilesDto,
  GetFileBase64Dto,
} from './dto/files.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'binary').toString(
          'utf-8',
        );
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFile: UploadFileDto,
  ) {
    return await this.filesService.createFile(file, uploadFile);
  }

  @Post('getFiles')
  async getFiles(@Body() getFiles: GetFilesDto) {
    return await this.filesService.getFiles(getFiles);
  }

  @Post('deletFiles')
  async deleteFiles(@Body() deleteFiles: DeleteFilesDto) {
    return await this.filesService.deleteFiles(deleteFiles);
  }

  @Post('getFileBase64')
  async getFileBase64(@Body() getFileBase64: GetFileBase64Dto) {
    return await this.filesService.getFileBase64(getFileBase64);
  }
}
