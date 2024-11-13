"use server"; 
import http from "@/lib/axios";
import { Ingredient } from "CustomTypes";
import { Recipe } from "CustomTypes";
import OpenAI from "openai";
import { revalidateTag, unstable_cache } from 'next/cache';
import { callApi } from "@/utils/callApi";


// Cache key generation function
const generateAnalysisCacheKey = (recipe: Recipe) => {
  return `recipe-analysis-${recipe._id}-${recipe.updatedAt}`;
};

export const invalidateAnalysisCache = async (recipe: Recipe) => {
  const tags = ['recipe-analysis'];
  await Promise.all(tags.map(tag => revalidateTag(tag)));
};


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
    const res = await callApi({
      url: `${API_URL}`,
      method: 'POST',
      body: recipeData,
      token,
      multipart: false,
    });
    return { status: res.status, data: res.data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const updateIngredients = async (recipeId: string, ingredientsData: Ingredient[], token: string) => {
  try {
    const res = await callApi({
      url: `${API_URL}/${recipeId}/ingredients`,
      method: 'PUT',
      body: { ingredients: ingredientsData },
      token,
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
  return unstable_cache(
    async () => {
      try {
        const { data } = await http.get(`${API_URL}/${recipeId}`);
        return data ?? null;
      } catch (error) {
        console.error("Error getting recipe by ID:", error);
        throw error;
      }
    },
    [`recipe-${recipeId}`],
    {
      revalidate: 60 * 60 * 30, // Cache for 30 minutes
      tags: [`recipe-${recipeId}`],
    }
  )();
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
    const { data } = await callApi({
      url: `${API_URL}/user`,
      method: 'GET',
      token,
    });
    return data;
  } catch (error) {
    console.error("Error getting recipes by user ID:", error);
    throw error;
  }
};

export const getFavoriteRecipes = async (token: string) => {
  try {
    const { data } = await callApi({
      url: `${API_URL}/favorite`,
      method: 'GET',
      token,
    });
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

  export const getRecipeAnalysis = unstable_cache(async (recipe: Recipe) => {
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
  }, ['recipe-analysis'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['recipe']
  });

interface SearchResult {
  isValid: boolean;
  keyList: string[];
}

export const enhanceSearch = async (query: string): Promise<SearchResult> => {
  const prompt = `Analyze the following Vietnamese recipe search query: "${query}"

CONTEXT:
- Đây là website dạy nấu ăn cho gia đình Việt Nam
- Tập trung vào từ khóa ẩm thực Việt Nam
- Đảm bảo kết quả phù hợp văn hóa và liên quan đến món ăn

TASKS:
1. Phân tích từ khóa tìm kiếm:
   - Xác định loại món ăn (món mặn, món chay, món tráng miệng)
   - Xác định phương pháp nấu (chiên, xào, hấp, nướng)
   - Xác định đặc điểm món ăn (cay, ngọt, béo, giảm cân)

2. Tạo danh sách từ khóa liên quan:
   - Nguyên liệu chính
   - Món ăn tương tự
   - Gia vị đặc trưng
   - Cách chế biến
   - Đặc tính dinh dưỡng

REQUIREMENTS:
- Mỗi từ khóa phải liên quan trực tiếp đến món ăn
- Ưu tiên từ khóa phổ biến trong nấu ăn
- Đảm bảo dấu tiếng Việt chính xác
- Kết hợp cả từ đơn và cụm từ có nghĩa
- Trả về 10 từ khóa liên quan nhất

Please respond in valid JSON format:  
{
  "isValid": boolean,
  "keywordList": string[]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsedResponse = JSON.parse(content);
    
    // Process and validate the response
    const processedKeyList = parsedResponse.isValid 
      ? parsedResponse.keywordList
          .map((word: string) => word.trim())
          .filter(Boolean)
          .filter((word: string, index: number, self: string[]) => 
            self.indexOf(word) === index && word.length > 1)
      : [];

    return {
      isValid: parsedResponse.isValid,
      keyList: processedKeyList
    };

  } catch (error) {
    console.error('Search enhancement error:', error);
    return {
      isValid: false,
      keyList: []
    };
  }
};

// ... mã hiện có ...