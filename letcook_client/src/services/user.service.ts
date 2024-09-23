import http from "@/lib/axios";
import { User } from "CustomTypes";

export const fetchProfile = async (userId: string) => {
    const response = await http.get(`/api/user/${userId}`);
    return response.data;
}

export const updateProfile = async (userId: string, data: {
    username?: string;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
    avatar?: string | null;
}) => {
    const response = await http.put(`/api/user/${userId}`, data);
    return response.data;
}

