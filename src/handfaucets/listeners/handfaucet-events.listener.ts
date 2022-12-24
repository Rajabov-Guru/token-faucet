import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FaucetLevelEvent } from '../events/faucet-level.event';
import { HandfaucetsService } from '../handfaucets.service';
import { getSettings } from '../../settings/faucet.settings';
import { NotificationsService } from '../../events/notifications.service';

@Injectable()
export class HandfaucetEventsListener {
  @Inject(HandfaucetsService)
  private readonly faucetService:HandfaucetsService;

  @Inject(NotificationsService)
  private readonly notificationsService: NotificationsService;

  @OnEvent('faucet.addTokens', {async:true})//чекать уровень аккаунта
  async handleRewardsEvent(event:FaucetLevelEvent) {
    const faucet = await this.faucetService.findOne(event.faucetId);
    const nextLevel = faucet.level+1;
    const settings = getSettings(nextLevel);
    if(faucet.clicks >= settings.requiredClicks){
      faucet.level = settings.level;
      await this.faucetService.save(faucet);
      await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`faucet-level-up`});
    }
  }
}