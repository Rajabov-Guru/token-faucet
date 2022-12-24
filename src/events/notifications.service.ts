import { Injectable } from '@nestjs/common';
import { EventsService } from './events.service';

@Injectable()
export class NotificationsService {

  constructor(private readonly eventsService: EventsService) {}

  async emitNotification(eventName:string,data){
    return this.eventsService.emit(eventName,data);
  }

}