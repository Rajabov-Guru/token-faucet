import { BonusSetting } from '../models/BonusSetting';

/*
Бонус за лояльность РЕФЕРАЛОВ т.е. если активен у РЕФЕРАЛОВ и ручной, и автоматический кран
 */
export const refLoyaltyBonus:BonusSetting = {
  value:0.25,
  clicks:5,
}