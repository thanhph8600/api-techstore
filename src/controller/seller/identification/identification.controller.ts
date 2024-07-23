import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { UpdateIdentificationDto } from './dto/update-identification.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('identification')
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() create: CreateIdentificationDto) {
    return this.identificationService.create(req.user, create);
  }

  @Get()
  findAll() {
    return this.identificationService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Request() req) {
    return this.identificationService.findOne(req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdentificationDto: UpdateIdentificationDto,
  ) {
    return this.identificationService.update(id, updateIdentificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identificationService.remove(+id);
  }
}
