import { NextResponse } from "next/server";

const API_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";
const API_TOKEN = process.env.GHN_API_TOKEN;

export async function GET(request: Request) {
    if (!API_TOKEN) {
        console.error("GHN_API_TOKEN is not set in environment variables");
        return NextResponse.json({ error: "API token is not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const provinceId = searchParams.get('provinceId');
    const districtId = searchParams.get('districtId');

    let endpoint = '';
    let method = 'GET';
    let body = null;

    switch (type) {
        case 'province':
            endpoint = '/province';
            break;
        case 'district':
            endpoint = '/district';
            method = 'POST';
            body = JSON.stringify({
                province_id: parseInt(provinceId || '0', 10)
            });
            break;
        case 'ward':
            endpoint = '/ward';
            method = 'POST';
            body = JSON.stringify({
                district_id: parseInt(districtId || '0', 10)
            });
            break;
        default:
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            body,
            headers: {
                'Content-Type': 'application/json',
                'Token': API_TOKEN
            }
        });

        const data = await response.json();
        if (data.code === 200) {
            return NextResponse.json(data.data);
        } else {
            return NextResponse.json({ error: data.message }, { status: 500 });
        }

    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return NextResponse.json({ error: `Error fetching ${type}` }, { status: 500 });
    }
}