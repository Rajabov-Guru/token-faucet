import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HandfaucetsService } from '../../handfaucets/handfaucets.service';
import { FaucetEvent } from '../events/faucet.event';
import { NotificationsService } from '../../events/notifications.service';
import { AutofaucetsService } from '../../autofaucets/autofaucets.service';
import { UsersService } from '../users.service';

@Injectable()
export class UserEventsListener{
  @Inject(UsersService)
  private readonly usersService:UsersService;

  @Inject(HandfaucetsService)
  private readonly handFaucetsService:HandfaucetsService;

  @Inject(AutofaucetsService)
  private readonly autoFaucetsService:AutofaucetsService;

  @Inject(NotificationsService)
  private readonly notificationsService: NotificationsService;

  @OnEvent('handfaucet_add_tokens',{async:true})
  async checkHandfaucetLevel(event:FaucetEvent){
    const isLevelUp = await this.handFaucetsService.checkLevel(event.faucetId);
    if(isLevelUp){
      await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`faucet-level-up`});
    }
  }

  @OnEvent('autofaucet_change_activated',{async:true})
  async checkUserLoyalty(userId:number){
    const isLoyal = this.usersService.checkLoyal(userId);
    //notifications
  }

  @OnEvent('autofaucet_add_satoshi',{async:true})
  async checkAutofaucetLevel(event:FaucetEvent){
    const isLevelUp = await this.autoFaucetsService.checkLevel(event.faucetId);
    if(isLevelUp){
      await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`autofaucet-level-up`});
    }
    await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`autofaucet-refetch`});
  }

  @OnEvent('autofaucet_subscription_activate',{async:true})
  async checkAutofaucetSubscription(event:FaucetEvent){
    const isActivated = await this.autoFaucetsService.activateSubscription(event.faucetId);
    if(isActivated){
      await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`autofaucet-subscription-activated`});
    }
    else{
      await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`autofaucet-subscription-delayed`});
    }
  }
}