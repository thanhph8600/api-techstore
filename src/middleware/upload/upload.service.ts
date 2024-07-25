import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  handleUploadedFile(file: Express.Multer.File) {
    console.log(file);
    // Add your file handling logic here, e.g., saving file info to a database
    return { message: 'File uploaded successfully', file };
  }
  handleUploadedFiles(files: Express.Multer.File[]) {
    const filenames = files.map((file) => file.filename);
    return { message: 'Files uploaded successfully', filenames };
  }

  deleteFile(filesToDelete: string[]) {
    try {
      filesToDelete.forEach((filename) => {
        const filePath = path.join(
          __dirname,
          '../../../uploads',
          getFilename(filename),
        );
        console.log(filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      return new HttpException('Xóa ảnh thành công!', HttpStatus.OK);
    } catch (error) {
      console.log('error deleteFile' + error);
      throw new InternalServerErrorException();
    }
  }
}
function getFilename(input) {
  if (input.includes('/')) {
    const parts = input.split('/');
    return parts[parts.length - 1];
  }
  return input;
}
