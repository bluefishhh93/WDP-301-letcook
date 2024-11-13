import { ProductType } from 'CustomTypes';

export const calculateWeigth = (cart: ProductType[] | undefined): number => {
  if (!cart || cart.length === 0) return 0;
  return cart.reduce((total, item) => {
    const weight = changeWeightUnit(item.amountToSell, item.measurement.name);
    return total + (item.quantity * weight);
  }, 0);
}

const changeWeightUnit = (weight: number, unit: string) => {
  switch (unit) {
    case 'g':
      return weight;
    case 'kg':
      return weight * 1000;
    case 'mg':
      return weight / 1000;
    default:
      return weight;
  }
}


