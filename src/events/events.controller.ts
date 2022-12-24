import { Controller, Inject, Param, Sse } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @Sse(':id/notifications')
  notifications(@Param('id') id:string) {
    const userId = +id;
    return this.eventsService.subscribe(`${userId}.notifications`);
  }
}
