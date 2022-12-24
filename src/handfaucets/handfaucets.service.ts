import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';
import { Repository } from 'typeorm';
import { FaucetLevelEvent } from './events/faucet-level.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class HandfaucetsService {

  constructor(@InjectRepository(Handfaucet) private readonly handfaucetRepository:Repository<Handfaucet>,
              private eventEmitter: EventEmitter2,
              private schedulerRegistry: SchedulerRegistry) {
  }

  async create() {
    const newFaucet = await this.handfaucetRepository.create();
    return this.handfaucetRepository.save(newFaucet);
  }

  findAll() {
    return this.handfaucetRepository.find();
  }

  findOne(id: number) {
    return this.handfaucetRepository.findOneBy({id});
  }

  save(handfaucet:Handfaucet){
    return this.handfaucetRepository.save(handfaucet);
  }

  async addTokens(id:number, tokens:number,energy:number){
    let handfaucet = await this.handfaucetRepository.findOne({where:{id},relations:{user:true}});
    handfaucet.tokens += tokens;
    handfaucet.energy += energy;
    handfaucet.clicks+=1;
    handfaucet = await this.setTimeStart(handfaucet);
    let saved = await this.handfaucetRepository.save(handfaucet);
    const faucetEvent = new FaucetLevelEvent();
    faucetEvent.faucetId = handfaucet.id;
    faucetEvent.userId = handfaucet.user.id;
    this.eventEmitter.emit('faucet.addTokens', faucetEvent);
    this.addRemoveTimerTimeout(saved);
    return saved;
  }

  async setTimeStart(faucet:Handfaucet){
    const now = new Date();
    now.setMilliseconds(0);
    faucet.timerStart = now;
    return await this.handfaucetRepository.save(faucet);
  }

  async removeTimeStart(faucet:Handfaucet){
    faucet.timerStart = null;
    return await this.handfaucetRepository.save(faucet);
  }

  addRemoveTimerTimeout(faucet:Handfaucet) {
    const name = `${faucet.id}.removeHandFaucetTimeStart`;
    const milliseconds = faucet.timerAmount * 60000;
    // const doesExist = this.schedulerRegistry.doesExist("timeout",name);
    // if(doesExist) this.schedulerRegistry.deleteTimeout(name);
    const callback = async() => {
      await this.removeTimeStart(faucet);
      this.schedulerRegistry.deleteTimeout(name);
      console.log(`Timeout ${name} executing after (${milliseconds})!`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

}
