import Openai from "openai";

const openai = new Openai({
    apiKey: process.env.OPENAI_API_KEY,
});



interface NutritionAnalysis {
    sugar: number;
    fat: number;
    protein: number;
    carbs: number;
    calories: number;
}


export async function POST(request: Request) {
    const body = await request.json();
    const { ingredients, servings } = body;

    try {

        const prompt = `
    You are a nutritionist. Please analyze the nutrition of the following recipe:
    Ingredients: ${ingredients.join(", ")}
    Servings: ${servings}
    `;

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

        return Response.json({ parsedResponse });

    } catch (error) {
        console.error(error);
        throw error;
    }


}
