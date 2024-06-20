import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { UpdateIdentificationDto } from './dto/update-identification.dto';

@Controller('identification')
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @Post()
  create(@Body() createIdentificationDto: CreateIdentificationDto) {
    return this.identificationService.create(createIdentificationDto);
  }

  @Get()
  findAll() {
    return this.identificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdentificationDto: UpdateIdentificationDto,
  ) {
    return this.identificationService.update(+id, updateIdentificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identificationService.remove(+id);
  }
}
