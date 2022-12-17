import { Controller, Sse } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('')
export class AppController{
  // constructor( private  readonly eventService:EventsService) {
  // }
  //
  // @Sse('user-level-up')
  // rewards() {
  //   return this.eventService.subscribe('user-level-up');
  // }

}