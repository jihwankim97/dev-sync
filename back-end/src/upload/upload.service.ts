import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { access, mkdir, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  async uploadFile(
    file: Express.Multer.File,
    uploadPath: string,
    filename?: string,
  ) {
    if (!file) {
      this.logger.warn('파일이 제공되지 않았습니다.');
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
      this.logger.error('파일 저장 실패');
      throw new InternalServerErrorException('파일 저장 실패');
    }

    return `http://localhost:3000/uploads/${uploadPath.replace('./uploads/', '')}/${finalFilename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      this.logger.warn('삭제할 파일 URL이 제공되지 않았습니다.');
      return;
    }

    try {
      const filePath = this.urlToFilePath(fileUrl);

      await access(filePath);
      await unlink(filePath);

      this.logger.log(`파일 삭제 완료: ${filePath}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(`삭제하려는 파일이 존재하지 않습니다: ${fileUrl}`);

        return;
      }

      this.logger.error(`파일 삭제 실패: ${fileUrl}`, error.message);
      throw new InternalServerErrorException('파일 삭제에 실패했습니다.');
    }
  }

  private urlToFilePath(fileUrl: string): string {
    const urlPath = fileUrl.replace('http://localhost:3000/', './');
    return urlPath;
  }
}
