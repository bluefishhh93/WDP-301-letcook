import http from "@/lib/axios";
import { callApi } from "@/utils/callApi";
import exp from "constants";
import { Ingredient } from "CustomTypes";
import { Recipe } from "CustomTypes";

const API_URL = "/api/recipe";

interface RecipeResponse {
  status: number;
  data: any;
}



export const createRecipe = async (
  recipeData: any,
  token: string
): Promise<RecipeResponse> => {
  try {
    const res = await callApi(`${API_URL}`, 'POST', recipeData, token);
    return { status: res.status, data: res.data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const updateIngredients = async (recipeId: string, ingredientsData: Ingredient[]) => {
  try {
    const res = await http.put(`${API_URL}/${recipeId}/ingredients`, {
      ingredients: ingredientsData
    });
    if (res.status !== 200) {
      throw new Error(`Failed to update ingredients. Status code: ${res.status}`);
    }
    return res.data;
  } catch (error) {
    console.error("Error updating ingredients:", error);
    throw error;
  }
};

export const getRecipeById = async (recipeId: string) => {
  try {
    const { data } = await http.get(`${API_URL}/${recipeId}`);
    return data ?? null;
  } catch (error) {
    console.error("Error getting recipe by ID:", error);
    throw error;
  }
};

export const getPublicRecipes = async (skip: number, take: number) => {
  try {
    const { data } = await http.get(`${API_URL}`, {
      params: { skip, take, isPublic: true }
    });
    return data;
  } catch (error) {
    console.error("Error getting active recipes:", error);
    throw error;
  }
}

export const searchRecipes = async (query: string, ingredients: string[], skip: number, limit: number) => {
  try {
    const params = new URLSearchParams();
    params.append('query', query);
    ingredients.forEach(ingredient => params.append('ingredients', ingredient));
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());

    const { data } = await http.get(`${API_URL}/search?${params.toString()}`);
    return data;
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};

export const getRecipesByUserId = async (token: string) => {
  try {
    const { data } = await callApi(`${API_URL}/user`, 'GET', null, token);
    return data;
  } catch (error) {
    console.error("Error getting recipes by user ID:", error);
    throw error;
  }
};

export const getFavoriteRecipes = async (token: string) => {
  try {
    const { data } = await callApi(`${API_URL}/favorite`, 'GET', null, token);
    return data;
  } catch (error) {
    console.error("Error getting favorite recipes:", error);
    throw error;
  }
}


export const reportRecipe = async (recipeId: string, userId: string, report: string) => {
  try {
    const { data } = await http.post(`${API_URL}/${recipeId}/report`, { userId, report });
    return data;
  } catch (error) {
    console.error("Error reporting recipe:", error);
    throw error;
  }
};

