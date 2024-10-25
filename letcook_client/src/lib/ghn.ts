import { ProductType } from 'CustomTypes';

export const calculateWeigth = (cart: ProductType[] | undefined): number => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => {
      const weight = item.measurement.name === 'mg' 
        ? item.amountToSell 
        : item.amountToSell * 1000;
      return total + (item.quantity * weight);
    }, 0);
  }


