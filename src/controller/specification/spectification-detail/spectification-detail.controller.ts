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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpectificationDetailDto: UpdateSpectificationDetailDto,
  ) {
    return this.spectificationDetailService.update(
      +id,
      updateSpectificationDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spectificationDetailService.remove(+id);
  }
}
