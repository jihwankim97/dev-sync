import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';

@Injectable()
export class UploadService {
  async uploadFile(
    file: Express.Multer.File,
    uploadPath: string,
    filename?: string,
  ) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const finalFilename =
      filename ||
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const filePath = join(uploadPath, finalFilename);

    try {
      await mkdir(uploadPath, { recursive: true });
      await writeFile(filePath, file.buffer as Uint8Array);
    } catch {
      throw new InternalServerErrorException('파일 저장 실패');
    }

    return `http://localhost:3000/uploads/${uploadPath.replace('./uploads/', '')}/${finalFilename}`;
  }
}
