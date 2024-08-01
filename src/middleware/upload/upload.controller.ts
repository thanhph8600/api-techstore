import {
  Controller,
  Post,
  UploadedFiles,
  Res,
  HttpStatus,
  UseInterceptors,
  Delete,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './upload.service';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

interface DeleteRequest {
  filesToDelete: string[];
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, `${uniqueSuffix}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.startsWith('image/') &&
          !file.mimetype.startsWith('video/')
        ) {
          cb(new Error('File is not an image'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      const result = this.uploadService.handleUploadedFiles(files);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Error uploading files:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error uploading files', error: error.message });
    }
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      url: `/uploads/${file.filename}`,
    };
  }

  @Delete('files')
  async deleteFiles(@Body() body: DeleteRequest, @Res() res: Response) {
    try {
      const { filesToDelete } = body;
      return await this.uploadService.deleteFile(filesToDelete);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error deleting files', error: error.message });
    }
  }
}
