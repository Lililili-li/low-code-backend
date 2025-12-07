import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  create(createUploadDto: CreateUploadDto) {
    return 'This action adds a new upload';
  }

  upload(file: any) {
    if (!file) {
      throw new HttpException({
        message: '未收到上传文件',
        code: 400,
        data: null,
      }, HttpStatus.BAD_REQUEST);
    }

    const ext = path.extname(file.originalname || '');
    let finalPath = file.path;
    let finalFilename = path.basename(file.path);

    // 如果保存后的文件没有扩展名，则补上原始扩展名
    if (ext && !finalPath.endsWith(ext)) {
      try {
        finalPath = `${file.path}${ext}`;
        finalFilename = `${path.basename(file.path)}${ext}`;
        fs.renameSync(file.path, finalPath);
      } catch (err) {
        throw new HttpException({
          message: '文件重命名失败',
          code: 500,
          data: null,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    const relativePath = path.join('file', finalFilename);
    return {
      message: '上传成功',
      code: 200,
      data: {
        filename: finalFilename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: relativePath,
      },
    };
  }
}
