import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

const uploadDir = path.join(process.cwd(), 'upload', 'file');
fs.mkdirSync(uploadDir, { recursive: true });

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    dest: uploadDir,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  }))
  uploadFile(@UploadedFile() file: any) {
    return this.uploadService.upload(file);
  }
}
