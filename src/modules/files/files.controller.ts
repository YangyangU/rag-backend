import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import {
  UploadFileDto,
  GetFilesDto,
  DeleteFilesDto,
  GetFileContentDto,
  GetFileContentByKbIdsDto,
} from './dto/files.dto';
import { fileMulterConfig } from 'src/config/multer.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', fileMulterConfig))
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

  @Post('deleteFiles')
  async deleteFiles(@Body() deleteFiles: DeleteFilesDto) {
    return await this.filesService.deleteFiles(deleteFiles);
  }

  @Post('getFileContent')
  async getFileContent(@Body() getFileContent: GetFileContentDto) {
    return await this.filesService.getFileContent(getFileContent);
  }

  @Post('getFileContentByIds')
  async getFileContentByIds(
    @Body() getFileContentByIds: GetFileContentByKbIdsDto,
  ) {
    return await this.filesService.getFileContentByIds(getFileContentByIds);
  }
}
