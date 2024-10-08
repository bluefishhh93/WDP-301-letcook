import http from "@/lib/axios";
import openai from "@/lib/openai";
import { ReviewType } from "CustomTypes";

interface NutritionAnalysis {
  sugar: number;
  fat: number;
  protein: number;
  carbs: number;
  calories: number;
}


export const createReview = async (reviewData: FormData): Promise<ReviewType | null> => {
  try {
    const response = await http.post('/api/review', reviewData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating review:', error);
    return null;
  }
};

export const getReview = async (productId: number, page: number = 1, limit: number = 3): Promise<{ reviews: ReviewType[], total: number } | null> => {
  try {
    const response = await http.get(`/api/product/${productId}/reviews`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return null;
  }
}

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    const response = await http.delete(`/api/review/${reviewId}`);
    return response.data;
    
  } catch (error: any) {
    console.error('Error deleting review:', error);
  }
}




export const getAstrologyPredictionAction = async ({ ingredients } : {
  ingredients: {
    ingredient: string;
    quantity: string;
  }[];
}) => {

    const prompt = ``;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Bạn là một chuyên gia xem tử vi chuyên nghiệp. Hãy trả lời theo định dạng JSON được yêu cầu.",
          },
          {
            role: "user",
            content: prompt,
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      const parsedResponse = JSON.parse(response || '{}') as NutritionAnalysis;

      return parsedResponse;

    } catch (error) {
      console.error(error);
      throw error;
    }
  };