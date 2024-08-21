import { Injectable } from '@nestjs/common';
import { CreateViolateDto } from './dto/create-violate.dto';
import { UpdateViolateDto } from './dto/update-violate.dto';

@Injectable()
export class ViolateService {
  create(createViolateDto: CreateViolateDto) {
    return 'This action adds a new violate';
  }

  findAll() {
    return `This action returns all violate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} violate`;
  }

  update(id: number, updateViolateDto: UpdateViolateDto) {
    return `This action updates a #${id} violate`;
  }

  remove(id: number) {
    return `This action removes a #${id} violate`;
  }
}
