import { BonusSetting } from '../models/BonusSetting';

/*
  Бонус за лояльность т.е. если активен у юзера и ручной, и автоматический кран
*/
export const userLoyaltyBonus:BonusSetting = {
  value: 5,
  clicks: 10
}