import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Knowledge } from '../knowledges/entities/knowledge.entity';
import { existsSync, readFileSync } from 'fs';
import {
  UploadFileDto,
  GetFilesDto,
  DeleteFilesDto,
  GetFileBase64Dto,
} from './dto/files.dto';
import { getMimeType } from '../../common/utils';

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

  getFileBase64(getFileBase64: GetFileBase64Dto): any {
    const { fileName } = getFileBase64;
    const filePath = `./uploads/${fileName}`;
    if (!existsSync(filePath)) {
      throw new BadRequestException({
        code: '404',
        message: '文件不存在',
      });
    }

    const fileExt = fileName.split('.')[1].toLowerCase();

    // 根据文件后缀判断 MIME 类型
    const mimeType = getMimeType(fileExt);

    // 读取文件并转换为 base64
    const fileData = readFileSync(filePath);
    const base64Data = fileData.toString('base64');

    return {
      code: 200,
      message: '获取成功',
      data: {
        fileName,
        ext: fileExt,
        base64: `data:${mimeType};base64,${base64Data}`,
      },
    };
  }
}
