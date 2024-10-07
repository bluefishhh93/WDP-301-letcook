// src/services/user.service.ts
import http from "@/lib/axios";



type UserProfile = {
    username?: string;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
    avatar?: string | null;
};
export const fetchProfile = async (userId: string) => {
  const response = await http.get(`/api/user/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const response = await http.put(`/api/user/${userId}`, data);
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