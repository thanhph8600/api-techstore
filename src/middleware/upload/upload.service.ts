import { Injectable } from '@nestjs/common';
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
  deleteFile(filename: string) {
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { message: 'File deleted successfully', filename };
    } else {
      throw new Error('File not found');
    }
  }
}
