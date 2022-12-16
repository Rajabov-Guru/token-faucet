import { Injectable } from '@nestjs/common';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';

@Injectable()
export class BonusesService {
  create(createBonusDto: CreateBonusDto) {
    return 'This action adds a new bonus';
  }

  findAll() {
    return `This action returns all bonuses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bonus`;
  }

  update(id: number, updateBonusDto: UpdateBonusDto) {
    return `This action updates a #${id} bonus`;
  }

  remove(id: number) {
    return `This action removes a #${id} bonus`;
  }
}
