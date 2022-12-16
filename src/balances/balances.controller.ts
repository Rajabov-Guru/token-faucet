import { Controller, Get, Param, Sse } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { EventsService } from './events.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService, private  readonly eventService:EventsService) {}

  @Sse('user-level-up')
  rewards() {
    return this.eventService.subscribe('user-level-up');
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
