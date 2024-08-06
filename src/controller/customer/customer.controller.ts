import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Public } from 'src/middleware/auth/public';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { UpdatePassword } from './dto/update-customer.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@ApiBearerAuth()
@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Public()
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('getOneUser')
  async getUser(@Request() req): Promise<any> {
    const user = await this.customerService.findUserById(req.user);
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('change-pass')
  changePass(@Request() req, @Body() updatePass: UpdatePassword) {
    return this.customerService.changePass(req.user, updatePass);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  // @Public()
  @Post('update-avatar')
  @UseInterceptors(
    FileInterceptor('avatar',
      {
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
        if (!file.mimetype.startsWith('image/')) {
          cb(new Error('File is not an image'), false);
        } else {
          cb(null, true);
        }
      },
    }
  ),
  )
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    console.log(file);

    if (!file) {
      throw new BadRequestException('Không có file nào được upload');
    }

    const avatarUrl = `/uploads/${file.filename}`;

    // Cập nhật avatarUrl vào cơ sở dữ liệu
    const oldAvatarPath = await this.customerService.updateAvatar(req.user, file);
    console.log("oldAvatarPath",oldAvatarPath);
    const finalOldAvatarPath = `/DATN/api-techstore/uploads/${oldAvatarPath}`

    const avatarDefault = `/DATN/api-techstore/uploads/avata-default.jpg`
    

    if (finalOldAvatarPath ) {
      if(finalOldAvatarPath === avatarDefault) {
        return
      }else {
        fs.unlink(finalOldAvatarPath, (err) => {
          if (err) {
            console.error(`Error deleting old avatar: ${err}`);
          } else {
            console.log(`Successfully deleted old avatar: ${finalOldAvatarPath}`);
          }
        });
      }
    }

    return {
      message: 'Avata được cập nhật thành công',
      file,
    };
  }
}
