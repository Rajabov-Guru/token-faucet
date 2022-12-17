import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BalanceRewardsEvent } from '../events/balance-rewards.event';
import { UsersService } from '../../users/users.service';
import { EventsService } from '../../events.service';

@Injectable()
export class BalanceEventsListener {
  @Inject(UsersService)
  private readonly userService:UsersService;

  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @OnEvent('balance.rewards', {async:true})//чекать уровень аккаунта
  async handleRewardsEvent(event:BalanceRewardsEvent) {
    const user = await this.userService.findOne(event.userId);
    const exp = event.experience;
    const level = user.level;
    if(Math.floor(exp/100)!==level-1){
      user.level +=1;
      await this.userService.save(user);
      await this.eventsService.emit(`${user.id}.user-level-up`,{eventType:`${user.id}.user-level-up`});
    }
  }
}