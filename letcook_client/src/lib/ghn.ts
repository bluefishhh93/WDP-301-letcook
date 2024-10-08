import { ProductType } from 'CustomTypes';
import { Ghn } from 'giaohangnhanh';
import { CreateOrder } from 'giaohangnhanh/lib/order';


const GHN_API_URL='https://dev-online-gateway.ghn.vn/shiip/public-api/v2/'
const GHN_API_TOKEN= process.env.GHN_API_TOKEN as string
const GHN_SHOP_ID=parseInt(process.env.GHN_SHOP_ID as string)
const GHN_TRACKING_URL='https://tracking.ghn.dev/'
const GHN_SHOP_DISTRICT_ID='1529'
const GHN_SHOP_WARD_CODE='20301'

console.log('GHN_API_URL:', GHN_API_URL);
console.log('GHN_API_TOKEN:', GHN_API_TOKEN);
console.log('GHN_SHOP_ID:', GHN_SHOP_ID);
console.log('GHN_TRACKING_URL:', GHN_TRACKING_URL);
console.log('GHN_SHOP_DISTRICT_ID:', GHN_SHOP_DISTRICT_ID);
console.log('GHN_SHOP_WARD_CODE:', GHN_SHOP_WARD_CODE);

// const ghn = new Ghn({
//     token: GHN_API_TOKEN,
//     shopId: GHN_SHOP_ID,
//     host: GHN_API_URL,
//     trackingHost: GHN_TRACKING_URL,
//     testMode: true,
// });

// export default ghn;

// export const createOrderGHN = async (
//     { order, districtId, wardCode, provinceId }:
//         { order: any, districtId: number, wardCode: string, provinceId?: number }
// ): Promise<any> => {
//     const payload: CreateOrder = {
//         payment_type_id: order.paymentMethod === 'cod' ? 2 : 1,
//         note: `Order #${order.id}`,
//         required_note: "KHONGCHOXEMHANG",
//         from_name: process.env.GHN_SHOP_NAME as string,
//         from_phone: process.env.GHN_SHOP_PHONE as string,
//         from_address: process.env.GHN_SHOP_ADDRESS as string,
//         from_ward_name: process.env.GHN_SHOP_WARD as string,
//         from_district_name: process.env.GHN_SHOP_DISTRICT as string,
//         from_province_name: process.env.GHN_SHOP_PROVINCE as string,
//         return_phone: process.env.GHN_SHOP_PHONE as string,
//         return_address: process.env.GHN_SHOP_ADDRESS as string,
//         return_district_id: null,
//         return_ward_code: "",
//         client_order_code: order.id.toString(),
//         to_name: order.name,
//         to_phone: order.phone,
//         to_address: order.shipAddress,
//         to_ward_code: wardCode, // You need to implement a function to get this from the order address
//         to_district_id: districtId, // You need to implement a function to get this from the order address
//         cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total) : 0,
//         content: `Order #${order.id}`,
//         weight: 200, // You might want to calculate this based on the order items
//         length: 10,
//         width: 10,
//         height: 10,
//         pick_station_id: 0,
//         insurance_value: Math.round(order.total),
//         service_id: 0,
//         service_type_id: 2,
//         coupon: null,
//         pick_shift: [2],
//         items: order.orderItems.map((item: any) => ({
//             name: item.product.name,
//             code: item.product.id.toString(),
//             quantity: item.quantity,
//             price: Math.round(item.subtotal / item.quantity),
//             length: 30,
//             width: 30,
//             height: 30,
//             weight: calculateWeigth(order.orderItems), // You might want to get this from the product data
//             category: {
//                 level1: "Jewelry"
//             }
//         }))
//     };

//     return ghn.order.createOrder(payload);
// }

export const calculateWeigth = (cart: ProductType[] | undefined): number => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => {
      const weight = item.measurement.name === 'mg' 
        ? item.amountToSell 
        : item.amountToSell * 1000;
      return total + (item.quantity * weight);
    }, 0);
  }


// export const getOrderInfoGHN = async (orderCode: string) => {
//     return ghn.order.orderInfo({ order_code: orderCode });
// }
