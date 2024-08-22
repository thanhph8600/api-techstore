import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Request,
} from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { Public } from 'src/middleware/auth/public';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { payload } from 'src/controller/customer/interface/customer.interface';

@ApiBearerAuth()
@ApiTags('specifications')
@Controller('specifications')
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @Public()
  @Post()
  create(@Body() createSpecificationDto: CreateSpecificationDto) {
    return this.specificationService.create(createSpecificationDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.specificationService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecificationDto: UpdateSpecificationDto,
  ) {
    return this.specificationService.update(+id, updateSpecificationDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specificationService.remove(id);
  }
}
