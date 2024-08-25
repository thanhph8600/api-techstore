import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpectificationDetailService } from './spectification-detail.service';
import { CreateSpectificationDetailDto } from './dto/create-spectification-detail.dto';
import { UpdateSpectificationDetailDto } from './dto/update-spectification-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/middleware/auth/public';

@ApiBearerAuth()
@ApiTags('specification-detail')
@Controller('specification-detail')
export class SpectificationDetailController {
  constructor(
    private readonly spectificationDetailService: SpectificationDetailService,
  ) {}

  @Post()
  create(@Body() createSpectificationDetailDto: CreateSpectificationDetailDto) {
    return this.spectificationDetailService.create(
      createSpectificationDetailDto,
    );
  }

  @Public()
  @Get()
  findAll() {
    return this.spectificationDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spectificationDetailService.findOne(+id);
  }

  @Public()
  @Get('get-by-idspecifi/:id_specification')
  async findByIdSpecification(@Param('id_specification') id_specification: string) {
    return await this.spectificationDetailService.findByIdSpecification(id_specification)
  }

  @Patch('')
  update(
    @Body('id') id: string,
    @Body('name') name: string,
  ) {
    console.log("name: ",name);
    console.log("id: ",id);
    return this.spectificationDetailService.update(id,name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spectificationDetailService.remove(+id);
  }
}
