import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';
import { Repository } from 'typeorm';
import { FaucetLevelEvent } from './events/faucet-level.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HandfaucetsService {

  constructor(@InjectRepository(Handfaucet) private readonly handfaucetRepository:Repository<Handfaucet>,
              private eventEmitter: EventEmitter2) {
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

  async addTokens(id:number, tokens:number){
    const handfaucet = await this.handfaucetRepository.findOne({where:{id},relations:{user:true}});
    handfaucet.tokens += tokens;
    handfaucet.clicks+=1;
    const saved = await this.handfaucetRepository.save(handfaucet);

    const faucetEvent = new FaucetLevelEvent();
    faucetEvent.faucetId = handfaucet.id;
    faucetEvent.userId = handfaucet.user.id;
    this.eventEmitter.emit('faucet.addTokens', faucetEvent);

    return saved;
  }

}
