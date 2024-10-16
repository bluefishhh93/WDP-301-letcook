import axios from 'axios';

export async function callApi(url: string, method: string, body?: any, token?: string) {
    const response = await axios({
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
    },
    data: body,
  });
  return response;
}