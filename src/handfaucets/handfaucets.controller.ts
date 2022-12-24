import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { HandfaucetsService } from './handfaucets.service';
import { SetTimestartDto } from './dto/set-timestart.dto';


@Controller('handfaucets')
export class HandfaucetsController {

  constructor(private readonly handfaucetsService: HandfaucetsService){}

  @Get()
  findAll() {
    return this.handfaucetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.handfaucetsService.findOne(+id);//
  }



}
