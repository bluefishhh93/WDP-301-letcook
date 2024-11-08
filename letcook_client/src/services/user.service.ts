// src/services/user.service.ts
import http from "@/lib/axios";
import { callApi } from "@/utils/callApi";



type UserProfile = {
    username?: string;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
    avatar?: string | null;
};

export const fetchProfile = async (token: string) => {
  const response = await callApi({
    url: `/api/user`,
    method: 'GET',
    token,
  });
  return response.data;
};

export const updateUserProfile = async (token: string, data: Partial<UserProfile>) => {
  const response = await callApi({
    url: `/api/user`,
    method: 'PUT',
    body: data,
    token,
  });
  return response.data;
};

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await http.post('/api/cloudinary', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.url;
};
export const getFollowingUsers = async (userId: string) => {
  const response = await http.get(`/api/users/following/${userId}`);
  return response.data;
};