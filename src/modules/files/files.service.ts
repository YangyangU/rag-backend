import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Knowledge } from '../knowledges/entities/knowledge.entity';
import { UploadFileDto, GetFilesDto, DeleteFilesDto } from './dto/files.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    @InjectRepository(Knowledge)
    private readonly knowledgeRepository: Repository<Knowledge>,
  ) {}

  async createFile(
    file: Express.Multer.File,
    uploadFile: UploadFileDto,
  ): Promise<any> {
    const { kbId } = uploadFile;
    const knowledge = await this.knowledgeRepository.findOne({
      where: { kbId },
    });
    if (!knowledge) {
      throw new BadRequestException({
        code: '404',
        message: '知识库不存在',
      });
    }

    const newFile = this.fileRepository.create({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      kbId,
    });

    return {
      code: 200,
      message: '上传成功',
      data: await this.fileRepository.save(newFile),
    };
  }

  async getFiles(getFiles: GetFilesDto): Promise<any> {
    const { kbId } = getFiles;
    const files = await this.fileRepository.find({
      where: { kbId },
    });
    return {
      code: 200,
      message: '获取成功',
      data: files,
    };
  }

  async deleteFiles(deleteFiles: DeleteFilesDto): Promise<any> {
    const { fileNames } = deleteFiles;
    await this.fileRepository.delete({ fileName: In(fileNames) });
    return {
      code: 200,
      message: '删除成功',
    };
  }
}
