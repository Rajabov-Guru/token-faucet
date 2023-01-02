import { DualBonusSetting } from '../models/DualBonusSetting';
import { HandfaucetBonus } from '../models/HandfaucetBonus';
import { AutofaucetBonus } from '../models/AutofaucetBonus';

/*
Бонус за повышение уровня крана рефами
*/
export const refFaucetAchieveLevelBonus:DualBonusSetting =
  new DualBonusSetting(
    new HandfaucetBonus(0.000125,1),
    new AutofaucetBonus(0.05,5)
  )