import { AxiosError } from 'axios';
import http from '@/lib/axios';
import { PaginatedProducts, ProductType, QueryParams } from 'CustomTypes';
import { buildQueryString } from '@/utils/commons.utils';
import handleAxiosError from '@/utils/handleError.utils';
import { callApi } from '@/utils/callApi';

const API_URL = '/api/products';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProducts = async (params: QueryParams) => {
  const queryString = buildQueryString(params);
  const response = await  http.get(`/api/shop/products?${queryString}`);
  const data = await response.data;
  return data;
};

export const getAllProducts = async (): Promise<ProductType[]> => {
  try {
    const res = await http.get<ProductType[]>(API_URL);
    return res.data;
  } catch (error) {
    handleAxiosError(error, 'Error fetching products');
    return [];
  }
}


export const createProduct = async ({productData, accessToken}: {productData: Omit<ProductType, 'id'>, accessToken: string}): Promise<ProductType | null> => {
  try {
    const res = await callApi({
      method: 'POST',
      url: API_URL,
      body: productData,
      token: accessToken,
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, 'Error creating product');
    return null;
  }
};

export const updateProduct = async ({productData, accessToken}: {productData: ProductType, accessToken: string}): Promise<ProductType | null> => {
  try {
    const res = await callApi({
      method: 'PUT',
      url: `${API_URL}/${productData.id}`,
      body: productData,
      token: accessToken,
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, 'Error updating product');
    return null;
  }
};

export const getProductById = async (id: number): Promise<ProductType | null> => {
  try {
    const res = await http.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    handleAxiosError(error, 'Error fetching product by ID');
    return null;
  }
};

export const getProductByCategory = async (categoryId: number): Promise<ProductType[] | null> => {
  try {
    const res = await http.get<ProductType[]>(`${API_URL}/findByCategoryId/${categoryId}`);
    return res.data;
  } catch (error) {
    handleAxiosError(error, 'Error fetching products by category');
    return null;
  }
};
