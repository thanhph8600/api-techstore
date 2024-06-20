import { Injectable } from '@nestjs/common';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { UpdateIdentificationDto } from './dto/update-identification.dto';

@Injectable()
export class IdentificationService {
  create(createIdentificationDto: CreateIdentificationDto) {
    console.log(createIdentificationDto);
    return 'This action adds a new identification';
  }

  findAll() {
    return `This action returns all identification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} identification`;
  }

  update(id: number, updateIdentificationDto: UpdateIdentificationDto) {
    console.log(updateIdentificationDto);
    return `This action updates a #${id} identification`;
  }

  remove(id: number) {
    return `This action removes a #${id} identification`;
  }
}
