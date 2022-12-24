import { Injectable } from '@nestjs/common';
import { Autofaucet } from './entities/autofaucet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivateByEnergyDto } from './dto/activate-by-energy.dto';
import { autoFaucetGeneralSettings } from '../settings/autofaucet.settings';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AutofaucetLevelEvent } from './events/autofaucet-level.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AutofaucetsService {
  constructor(@InjectRepository(Autofaucet) private autofaucetRepository:Repository<Autofaucet>,
              private eventEmitter: EventEmitter2,
              private schedulerRegistry: SchedulerRegistry) {
  }

  findAll() {
    return this.autofaucetRepository.find();
  }

  findOne(id: number) {
    return this.autofaucetRepository.findOneBy({id});
  }

  async save(autofaucet:Autofaucet){
    return this.autofaucetRepository.save(autofaucet);
  }

  async addSatoshi(id:number, satoshi:number){
    let faucet = await this.autofaucetRepository.findOne({where:{id},relations:{user:true}});
    faucet.satoshi += satoshi;
    faucet.clicks+=1;
    let saved = await this.autofaucetRepository.save(faucet);
    const faucetEvent = new AutofaucetLevelEvent();
    faucetEvent.autofaucetId = faucet.id;
    faucetEvent.userId = faucet.user.id;
    this.eventEmitter.emit('autofaucet.addSatoshi', faucetEvent);
    return saved;
  }

  async activateByEnergy(dto:ActivateByEnergyDto){
    const faucet = await this.findOne(dto.id);
    const secondsForOneSatoshi = autoFaucetGeneralSettings.secondsForOneSatoshi;
    const seconds = dto.energy * secondsForOneSatoshi;
    const now = new Date();
    now.setMilliseconds(0);
    faucet.timerStart = now;
    faucet.activated = true;
    const count = Math.floor(seconds/(faucet.timerAmount*60));
    faucet.rewardCount = count;

    const saved = this.autofaucetRepository.save(faucet);

    this.addRemoveTimerTimeout(faucet,seconds);
    this.addRewardInterval(faucet);

    return saved;
  }

  addRemoveTimerTimeout(faucet:Autofaucet,seconds:number) {
    const name = `${faucet.id}.removeAutoFaucetTimeStart`;
    const milliseconds = seconds * 1000;
    // const doesExist = this.schedulerRegistry.doesExist("timeout",name);
    // if(doesExist) this.schedulerRegistry.deleteTimeout(name);
    const callback = async() => {
      await this.removeTimeStart(faucet);
      this.schedulerRegistry.deleteTimeout(name);
      console.log(`Timeout ${name} executing after (${milliseconds})!`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
    console.log(`Timeout ${name} set in (${milliseconds})!`);
  }

  addRewardInterval(faucet:Autofaucet){
    const milliseconds = faucet.timerAmount*60000;
    const name = `${faucet.id}.getRewardInterval`;

    const callback = async() => {
      if(faucet.rewardCount===0) {
        this.schedulerRegistry.deleteInterval(name);
        return;
      }
      faucet.rewardCount -=1;
      console.log('count - 1')
      await this.autofaucetRepository.save(faucet);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
    console.log(`Interval ${name} set in every (${milliseconds})!`);
  }

  async removeTimeStart(faucet:Autofaucet){
    faucet.timerStart = null;
    faucet.activated = false;
    return await this.autofaucetRepository.save(faucet);
  }


}
