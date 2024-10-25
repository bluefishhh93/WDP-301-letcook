import { NextResponse } from 'next/server';

const GHN_API_URL = process.env.GHN_API_URL;
const GHN_API_TOKEN = process.env.GHN_API_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;
const GHN_SHOP_DISTRICT_ID = process.env.GHN_SHOP_DISTRICT_ID;
const GHN_SHOP_WARD_CODE = process.env.GHN_SHOP_WARD_CODE;

export async function POST(request: Request) {
  try {
    const { to_district_id, to_ward_code, weight } = await request.json();

    if (!to_district_id || !to_ward_code || !weight) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const payload = {
      to_district_id,
      to_ward_code,
      service_type_id: null,
      weight,
      length: 10,
      width: 10,
      height: 10,
      insurance_value: 100000,
      cod_failed_amount: 100000,
      from_district_id: parseInt(GHN_SHOP_DISTRICT_ID || '0'),
      from_ward_code: GHN_SHOP_WARD_CODE,
      service_id: 53321,
      coupon: null,
    };


    const response = await fetch(`${GHN_API_URL}shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_API_TOKEN || '',
        'ShopId': GHN_SHOP_ID || '',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GHN API Error:', errorData);
      return NextResponse.json({ error: `Failed to calculate shipping fee: ${JSON.stringify(errorData)}` }, { status: response.status });
    }

    const { data } = await response.json();
    return NextResponse.json({ fee: data.total });
  } catch (error: any) {
    console.error('Error calculating shipping fee:', error);
    return NextResponse.json({ error: error.message || 'Failed to calculate shipping fee' }, { status: 500 });
  }
}