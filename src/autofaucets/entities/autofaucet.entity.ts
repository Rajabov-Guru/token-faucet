import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Autofaucet {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({default:1})
  level:number;

  @Column({default:0})
  spentTime:number;

  @Column({default:0})
  timeBalance:number;

  @Column({default:null, nullable:true})
  timerStart:Date;

  @Column({default:1})
  timerAmount:number;

  @Column({default:0})
  rewardCount:number;

  @Column({default:0})
  clicks:number;

  @Column({type:'double', default:0})
  satoshi:number;

  @Column({default:false})
  activated:boolean;

  @Column({default:0})
  activatedTime:number;

  @Column({default:null, nullable:true})
  activatedStart:Date;

  @Column({default:false})
  subscription:boolean;

  @Column({default:0})
  subscriptionMonth:number;

  @Column({default:null, nullable:true})
  subscriptionStart:Date;

  @OneToOne(()=>User)
  @JoinColumn()
  user: User;

}
