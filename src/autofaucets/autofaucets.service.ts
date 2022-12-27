import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Autofaucet } from './entities/autofaucet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { ActivateByEnergyDto } from './dto/activate-by-energy.dto';
import { autoFaucetGeneralSettings } from '../settings/autofaucet.settings';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AutofaucetLevelEvent } from './events/autofaucet-level.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';

@Injectable()
export class AutofaucetsService {
  @InjectRepository(Autofaucet)
  private autofaucetRepository:Repository<Autofaucet>;

  @Inject(forwardRef(()=>UsersService))
  private readonly userService:UsersService;

  @Inject(EventEmitter2)
  private eventEmitter: EventEmitter2;

  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;

  constructor() {
  }

  async setAllTimeouts(){
    const timingFaucets = await this.findAllTiming();
    for (let i = 0; i < timingFaucets.length; i++) {
      const faucet:Autofaucet = timingFaucets[0];

      const name = `${faucet.id}.removeHandFaucetTimeStart`;
      const faucetStart = new Date(faucet!.timerStart);
      const now = new Date();
      now.setMilliseconds(0);
      const diff = now.getTime() - faucetStart.getTime();
      const milliseconds = (faucet.timerAmount * 60000) - diff;

      const callback = async() => {
        await this.rewardTimeoutCallback(faucet,name,milliseconds);
      };

      const timeout = setTimeout(callback, milliseconds);
      this.schedulerRegistry.addTimeout(name, timeout);
    }
  }

  findAll() {
    return this.autofaucetRepository.find();
  }

  async findAllTiming() {
    return this.autofaucetRepository.find({
      where:{
        timerStart:Not(IsNull()),
      }
    });
  }

  findOne(id: number) {
    return this.autofaucetRepository.findOneBy({id});
  }

  async save(autofaucet:Autofaucet){
    return this.autofaucetRepository.save(autofaucet);
  }

  async getUser(id:number){
    const autofaucet = await this.autofaucetRepository.findOne({
      where:{id},
      relations:{
        user:true,
      }
    });

    return autofaucet.user;
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
    this.addRewardTimeouts(faucet);
    return saved;
  }

  async rewardTimeoutCallback(faucet:Autofaucet, name:string, milliseconds:number){
    const user = await this.getUser(faucet.id);
    faucet.rewardCount -=1;
    await this.userService.setAutoRewards(user.id);
    console.log('count - 1')
    faucet = await this.autofaucetRepository.save(faucet);

    if(faucet.rewardCount===0) {
      await this.removeTimeStart(faucet);
      this.schedulerRegistry.deleteInterval(name);
      return;
    }

    const callback = async() => {
      await this.rewardTimeoutCallback(faucet,name,milliseconds);
    };

    this.schedulerRegistry.deleteTimeout(name);
    const nextTimeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name,nextTimeout);
    await this.setTimeStart(faucet);
    console.log(`2_Timeout ${name} set in (${milliseconds})!`);
  }

  addRewardTimeouts(faucet:Autofaucet){
    const milliseconds = faucet.timerAmount*60000;
    const name = `${faucet.id}.getRewardInterval`;

    const callback = async() => {
      await this.rewardTimeoutCallback(faucet,name,milliseconds);
    };

    const nextTimeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name,nextTimeout);
    console.log(`Timeout ${name} set in (${milliseconds})!`);
  }

  async setTimeStart(faucet:Autofaucet){
    const now = new Date();
    now.setMilliseconds(0);
    faucet.timerStart = now;
    return await this.autofaucetRepository.save(faucet);
  }

  async removeTimeStart(faucet:Autofaucet){
    faucet.timerStart = null;
    faucet.activated = false;
    return await this.autofaucetRepository.save(faucet);
  }


}
