import { Inject, Injectable } from '@nestjs/common';
import { EventsService } from '../../events.service';
import { OnEvent } from '@nestjs/event-emitter';
import { FaucetLevelEvent } from '../events/faucet-level.event';
import { HandfaucetsService } from '../handfaucets.service';
import { getSettings, handfaucetSettings } from '../../helpers/faucet.settings';

@Injectable()
export class HandfaucetEventsListener {
  @Inject(HandfaucetsService)
  private readonly faucetService:HandfaucetsService;

  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @OnEvent('faucet.addTokens', {async:true})//чекать уровень аккаунта
  async handleRewardsEvent(event:FaucetLevelEvent) {
    const faucet = await this.faucetService.findOne(event.faucetId);
    const nextLevel = faucet.level+1;
    const settings = getSettings(nextLevel);
    if(faucet.clicks >= settings.requiredClicks){
      faucet.level = settings.level;
      await this.faucetService.save(faucet);
      await this.eventsService.emit(`${event.userId}.faucet-level-up`,{eventType:`${event.userId}.faucet-level-up`});
    }
  }
}