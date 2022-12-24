import { Inject, Injectable } from '@nestjs/common';
import { AutofaucetsService } from '../autofaucets.service';
import { NotificationsService } from '../../events/notifications.service';
import { OnEvent } from '@nestjs/event-emitter';
import { FaucetLevelEvent } from '../../handfaucets/events/faucet-level.event';
import { getSettings } from '../../settings/faucet.settings';
import { AutofaucetLevelEvent } from '../events/autofaucet-level.event';
import { getAutoSettings } from '../../settings/autofaucet.settings';

@Injectable()
export class AutofaucetEventsListener{
  @Inject()
  private autofaucetService:AutofaucetsService;

  @Inject(NotificationsService)
  private readonly notificationsService: NotificationsService;

  @OnEvent('autofaucet.addSatoshi', {async:true})
  async handleRewardsEvent(event:AutofaucetLevelEvent) {
    const faucet = await this.autofaucetService.findOne(event.autofaucetId);
    const nextLevel = faucet.level+1;
    const settings = getAutoSettings(nextLevel);
    if(faucet.clicks >= settings.requiredClicks){
      faucet.level = settings.level;
      await this.autofaucetService.save(faucet);
      await this.notificationsService.emitNotification(`${event.userId}.notifications`,{eventType:`autofaucet-level-up`});
    }
  }
}