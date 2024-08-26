import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ViolateService } from './violate.service';
import { CreateViolateDto } from './dto/create-violate.dto';
import { UpdateViolateDto } from './dto/update-violate.dto';

@Controller('violate')
export class ViolateController {
  constructor(private readonly violateService: ViolateService) {}

  @Post()
  create(@Body() createViolateDto: CreateViolateDto) {
    return this.violateService.create(createViolateDto);
  }

  @Get()
  findAll() {
    return this.violateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.violateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViolateDto: UpdateViolateDto) {
    return this.violateService.update(+id, updateViolateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.violateService.remove(+id);
  }
}
