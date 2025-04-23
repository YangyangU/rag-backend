import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThanOrEqual } from 'typeorm';
import { File } from './entities/file.entity';
import { Knowledge } from '../knowledges/entities/knowledge.entity';
import {
  UploadFileDto,
  GetFilesDto,
  DeleteFilesDto,
  GetFileContentDto,
  GetFileContentByKbIdsDto,
  GetFileCountByDateDto,
} from './dto/files.dto';
import * as fs from 'fs';
import * as path from 'path';
import { extractFileContent } from '../../common/fileParser';

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

    // 解析文件内容
    const content = await extractFileContent(file.path);

    const newFile = this.fileRepository.create({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      kbId,
      content,
      createTime: new Date().toISOString(),
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
    //删除对应的文件
    fileNames.forEach((fileName) => {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'files',
        fileName,
      );
      fs.unlinkSync(filePath);
    });
    return {
      code: 200,
      message: '删除成功',
    };
  }

  async getFileContent(getFileContent: GetFileContentDto): Promise<any> {
    const { fileName } = getFileContent;
    const file = await this.fileRepository.findOne({
      where: { fileName },
    });
    if (!file) {
      throw new BadRequestException({
        code: '404',
        message: '文件不存在',
      });
    }
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'files',
      fileName,
    );
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      code: 200,
      message: '获取成功',
      data: content,
    };
  }

  async getFileContentByIds(
    getFileContentByIds: GetFileContentByKbIdsDto,
  ): Promise<any> {
    const { kbIds } = getFileContentByIds;
    const files = await this.fileRepository.find({
      where: { kbId: In(kbIds) },
    });
    const contents = files.map((file) => file.content);

    return contents;
  }
  async getFileCountByDate(
    getFileCountByDateDto: GetFileCountByDateDto,
  ): Promise<any> {
    const { role, date } = getFileCountByDateDto;
    if (role === 'admin') {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - date); // 当前日期减去指定天数

      // 查询该时间范围内的文件
      const files = await this.fileRepository.find({
        where: {
          createTime: MoreThanOrEqual(startDate.toISOString()), // 查询大于等于startDate的记录
        },
      });

      // 按日期分组统计文件数量
      const dateCountMap = new Map<string, number>();
      files.forEach((file) => {
        const date = new Date(file.createTime).toISOString().split('T')[0]; // 获取日期部分
        if (dateCountMap.has(date)) {
          dateCountMap.set(date, dateCountMap.get(date) ?? 0 + 1);
        } else {
          dateCountMap.set(date, 1);
        }
      });

      // 转换为指定格式
      const result = Array.from(dateCountMap).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        code: 200,
        message: '获取文件数量成功',
        data: result,
      };
    }
    return {
      code: 403,
      message: '无权访问知识库统计信息',
    };
  }
}
