"use server"; 
import http from "@/lib/axios";
import { callApi } from "@/utils/callApi";
import exp from "constants";
import { Ingredient } from "CustomTypes";
import { Recipe } from "CustomTypes";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY as string;

let openai = new OpenAI({
    apiKey: apiKey,
});

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
    const res = await callApi(`${API_URL}`, 'POST', recipeData, token, true);
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

export const searchRecipes = async (searchWords: string[], ingredients: string[], skip: number, limit: number) => {
  try {
    const params = new URLSearchParams();
    searchWords.forEach(word => params.append('searchWords', word));
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

// ... existing code ...

export const getRecipeAnalysis = async (recipe: Recipe) => {
  const prompt = `Analyze the following recipe and provide:
1. Nutritional information: calories, protein (g), fat (g), carbs (g)
2. Taste profile: sweetness, sourness, saltiness, bitterness, savoriness, fattiness (scale of 0-100)

Recipe:
${recipe.title}
Ingredients: ${recipe.ingredients.map(i => `${i.quantity} ${i.name}`).join(', ')}
Instructions: ${recipe.steps.join(' ')}

Provide the analysis in the following JSON format:
{
  "nutrition": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number
  },
  "taste": {
    "sweet": number,
    "sour": number,
    "salty": number,
    "bitter": number,
    "savory": number,
    "fatty": number
  }
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  console.log(response.choices[0].message.content);

  const analysisText = response.choices[0].message.content;
  const parsedResponse = JSON.parse(analysisText || "{}");
  return parsedResponse;
};

export const enhanceSearch = async (query: string) => {
  const prompt = `Analyze the following recipe search query: "${query}"

1. Determine if the query is appropriate for a family-friendly recipe website. If it contains inappropriate, offensive, or adult content, mark it as invalid.

2. If valid, provide a list of related single words in Vietnamese for recipe search, including:
   - Main ingredients
   - Dish types
   - Cooking methods
   - Flavors
   - Cuisines

3. Follow these guidelines:
   - Single Words Only: Each item should be a single word in Vietnamese.
   - Diversity: Ensure a mix of ingredients, dish types, cooking methods, and flavors.
   - Relevance: All words should be closely related to the original query.
   - Quantity: Provide 10-15 unique, single words or two-word combinations.

Respond in the following JSON format:
{
  "isValid": boolean,
  "keywordList": string[], // 10-15 related single words in Vietnamese. Empty array if isValid is false.
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Error calling OpenAI");
    }

    const parsedResponse = JSON.parse(content);
    console.log(parsedResponse);

    // Additional processing to ensure single words
    const processedKeyList = parsedResponse.keywordList
      .flatMap((word: string) => word.split(/\s+/))  // Split any multi-word entries
      .filter((word: string, index: number, self: string[]) => self.indexOf(word) === index)  // Remove duplicates
      .slice(0, 15);  // Limit to 15 words

    return {
      isValid: parsedResponse.isValid,
      keyList: processedKeyList,
    };
  } catch (error) {
    console.error("Error in enhanceSearch:", error);
    return { isValid: false, keyList: [], explanation: "An error occurred during search enhancement." };
  }
};

// ... mã hiện có ...