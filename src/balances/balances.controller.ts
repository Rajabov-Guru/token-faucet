import { Controller, Get, Param, Sse } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { EventsService } from '../events.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService, private  readonly eventService:EventsService) {}

  @Sse(':id/user-level-up')
  rewards(@Param('id') id:string) {
    const userId = +id;
    return this.eventService.subscribe(`${userId}.user-level-up`);
  }

  @Get()
  findAll() {
    return this.balancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balancesService.findOne(+id);
  }

}
