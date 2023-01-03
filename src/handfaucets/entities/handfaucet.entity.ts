import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Handfaucet {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({default:1})
  level:number;

  @Column({default:null, nullable:true})
  timerStart:Date;

  @Column({default:1})
  timerAmount:number;

  @Column({default:0})
  clicks:number;

  @Column({type:'double', default:0})
  tokens:number;

  @Column({default:0})
  energy:number;

  @Column({default:false})
  vip:boolean;

  @Column({default:0})
  vipActivatedTime:number;

  @Column({default:null, nullable:true})
  vipStart:Date;

  @Column({default:null, nullable:true})
  vipRemoveDayStart:Date;

  @Column({default:0})
  vipDays:number;

  @OneToOne(()=>User)
  @JoinColumn()
  user: User;
}
