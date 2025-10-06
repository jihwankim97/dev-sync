import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

@Injectable()
export class UploadService {
  async uploadFile(
    file: Express.Multer.File,
    uploadPath: string,
    filename?: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const finalFilename =
      filename ||
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const filePath = join(uploadPath, finalFilename);

    writeFileSync(filePath, file.buffer as any);

    return `http://localhost:3000/uploads/${uploadPath.replace('./uploads/', '')}/${finalFilename}`;
  }
}
