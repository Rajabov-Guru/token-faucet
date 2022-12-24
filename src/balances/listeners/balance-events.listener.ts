import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BalanceRewardsEvent } from '../events/balance-rewards.event';
import { UsersService } from '../../users/users.service';
import { NotificationsService } from '../../events/notifications.service';


@Injectable()
export class BalanceEventsListener {
  @Inject(UsersService)
  private readonly userService:UsersService;

  @Inject(NotificationsService)
  private readonly notificationsService: NotificationsService;

  @OnEvent('balance.rewards', {async:true})//чекать уровень аккаунта
  async handleRewardsEvent(event:BalanceRewardsEvent) {
    const user = await this.userService.findOne(event.userId);
    const exp = event.experience;
    const level = user.level;
    if(Math.floor(exp/100)!==level-1){
      user.level +=1;
      await this.userService.save(user);
      await this.notificationsService.emitNotification(`${user.id}.notifications`,{eventType:`user-level-up`, payload:user});
    }
  }
}