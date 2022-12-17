import { Controller, Get, Param, Sse } from '@nestjs/common';
import { HandfaucetsService } from './handfaucets.service';
import { EventsService } from '../events.service';


@Controller('handfaucets')
export class HandfaucetsController {

  constructor(private readonly handfaucetsService: HandfaucetsService,
              private readonly eventService:EventsService) {}


  @Sse(':id/faucet-level-up')
  faucetLevel(@Param('id') id:string){
    const userId = +id;
    return this.eventService.subscribe(`${userId}.faucet-level-up`);
  }

  @Get()
  findAll() {
    return this.handfaucetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.handfaucetsService.findOne(+id);
  }

}
