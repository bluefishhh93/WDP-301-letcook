import http from "@/lib/axios";
import { callApi } from "@/utils/callApi";
import { Ingredient } from "CustomTypes";
import { Recipe } from "CustomTypes";

const API_URL = "/api/post";
export const getPostWithUserId = async (token: string) => {

    try {
        const { data } = await callApi({
            url: `${API_URL}/user`,
            method: 'GET',
            token,
        });
        return data;
    } catch (error) {
        console.error("Error getting posts by user ID:", error);
        throw error;
    }
};