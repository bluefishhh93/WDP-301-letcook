import axios from 'axios';

export async function callApi(url: string, method: string, body?: any, token?: string, multipart: boolean = false) {
    const response = await axios({
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    method: method,
    headers: {
      'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
    },
    data: body,
  });
  return response;
}