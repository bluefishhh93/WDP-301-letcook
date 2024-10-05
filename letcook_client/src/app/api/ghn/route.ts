import { error } from "console";
import { NextResponse } from "next/server";


const GHN_API_URL = process.env.GHN_API_URL;
const GHN_TOKEN = process.env.GHN_API_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;


//order detail
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_code = searchParams.get('order_code');

    if (!order_code) {
      return NextResponse.json({ error: 'Order code is required' }, { status: 400 });
    }

    const response = await fetch(GHN_API_URL + 'shipping-order/detail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN as string,
      },
      body: JSON.stringify({ order_code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch order details' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

//create order
export async function POST(request: Request) {
 try {
    const body = await request.json();
     
 } catch (error) {
    
 }
}

