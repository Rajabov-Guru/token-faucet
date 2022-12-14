interface Rewards{
  base:number;
  levelBonus:number;
  experience:number;
}

interface AutoFaucetSetting{
  level:number;
  requiredClicks:number;
  subscriptionCost:number;
  rewards:Rewards;
}

interface AutoFaucetGeneralSetting{
  secondsForOneSatoshi:number;
}

export const getAutoSettings = (level:number)=>{
  return autofaucetSettings.filter(set=>set.level===level)[0];
}

export const getSubscriptionDiscount = (monthCount:number):number | null =>{
  const filterResult = DiscountOnSubscription.filter(dis=>dis.monthCount === monthCount);
  if(filterResult.length){
    const item = filterResult[0];
    return item.discount;
  }
  return null;
}

interface SubscriptionDiscount{
  monthCount:number;
  discount:number;
}

export const autoFaucetGeneralSettings:AutoFaucetGeneralSetting = {
  secondsForOneSatoshi:30,
};

export const autofaucetSettings:AutoFaucetSetting[] = [
  {
    level:1,
    requiredClicks:0,
    subscriptionCost:1000,
    rewards:{
      base:10,
      levelBonus:0,
      experience:10,
    }
  },
  {
    level:2,
    requiredClicks:1,
    subscriptionCost:10000,
    rewards:{
      base:10,
      levelBonus:15,
      experience:10,
    }
  },
  {
    level:3,
    requiredClicks:10,
    subscriptionCost:50000,
    rewards:{
      base:20,
      levelBonus:25,
      experience:12,
    }
  },
  {
    level:4,
    requiredClicks:100,
    subscriptionCost:100000,
    rewards:{
      base:50,
      levelBonus:35,
      experience:15,
    }
  },
  {
    level:5,
    requiredClicks:1000,
    subscriptionCost:500000,
    rewards:{
      base:100,
      levelBonus:45,
      experience:20,
    }
  },
  {
    level:6,
    requiredClicks:10000,
    subscriptionCost:1000000,
    rewards:{
      base:500,
      levelBonus:55,
      experience:25,
    }
  },
  {
    level:7,
    requiredClicks:100000,
    subscriptionCost:5000000,
    rewards:{
      base:5000,
      levelBonus:65,
      experience:32,
    }
  },
  {
    level:8,
    requiredClicks:1000000,
    subscriptionCost:10000000,
    rewards:{
      base:100000,
      levelBonus:75,
      experience:40,
    }
  },
  {
    level:9,
    requiredClicks:10000000,
    subscriptionCost:50000000,
    rewards:{
      base:500000,
      levelBonus:85,
      experience:45,
    }
  },
  {
    level:10,
    requiredClicks:100000000,
    subscriptionCost:100000000,
    rewards:{
      base:1000000,
      levelBonus:105,
      experience:50,
    }
  },
  {
    level:11,
    requiredClicks:1000000000,
    subscriptionCost:1000000000,
    rewards:{
      base:2000000,
      levelBonus:115,
      experience:60,
    }
  },
];

export const DiscountOnSubscription:SubscriptionDiscount[] = [
  {
    monthCount:1,
    discount:0,
  },
  {
    monthCount:2,
    discount:3,
  },
  {
    monthCount:3,
    discount:4,
  },
  {
    monthCount:4,
    discount:5,
  },
  {
    monthCount:5,
    discount:6,
  },
  {
    monthCount:6,
    discount:7,
  },
  {
    monthCount:7,
    discount:8,
  },
  {
    monthCount:8,
    discount:9,
  },
  {
    monthCount:9,
    discount:10,
  },
  {
    monthCount:10,
    discount:11,
  },
  {
    monthCount:11,
    discount:12,
  },
  {
    monthCount:12,
    discount:20,
  },
]
