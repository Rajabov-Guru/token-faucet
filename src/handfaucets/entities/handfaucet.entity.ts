import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Handfaucet {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({default:1})
  level:number;

  @Column({default:false})
  vip:boolean;

  @Column({default:null, nullable:true})
  timerStart:string;

  @Column({default:60})
  timerAmount:number;

  @Column({default:0})
  clicks:number;

  @Column({default:0})
  tokens:number;

  @OneToOne(()=>User)
  @JoinColumn()
  user: User;
}
