'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDFjq7SRLpi2sbyD1h77V9dRQBa1StIgYA');

export interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients: Record<string, string>;
}

export async function estimateNutrition(foodName: string): Promise<NutritionData | null> {
    if (!process.env.GEMINI_API_KEY) {
        console.error('SERVER ERROR: GEMINI_API_KEY is not set');
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const prompt = `Analyze the nutritional value of "${foodName}" per typical serving. 
        Return a valid JSON object with the following structure:
        {
            "calories": number (integer),
            "protein": number (grams, integer),
            "carbs": number (grams, integer),
            "fat": number (grams, integer),
            "micronutrients": {
                "Iron": "quantity with unit",
                "Calcium": "quantity with unit",
                "Vitamin C": "quantity with unit",
                ... (include major ones)
            }
        }
        Return ONLY the JSON. No markdown code blocks.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown just in case
        text = text.replace(/```(\w+)?/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);
        return {
            calories: data.calories || 0,
            protein: data.protein || 0,
            carbs: data.carbs || 0,
            fat: data.fat || 0,
            micronutrients: data.micronutrients || {}
        };
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return null;
    }
}

export async function getNutritionAdvice(history: any[], profile: any): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return 'Lỗi: Chưa cấu hình API Key.';

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const historyText = history.map(h =>
            `- ${h.name}: ${h.calories}kcal (P:${h.protein}g, C:${h.carbs}g, F:${h.fat}g)`
        ).join('\n');

        const profileText = profile ?
            `User Profile: TDEE ${profile.tdee}kcal, Weight ${profile.weight}kg, Goal: Health/Fitness` :
            'User Profile: Unknown (assume average adult 2000kcal TDEE)';

        const prompt = `
        You are a smart Personal Nutritionist.
        
        ${profileText}
        
        Today's Intake so far:
        ${historyText}

        Task: 
        1. Evaluate the nutrition balance of today (Calories, Macros).
        2. Give a short, encouraging comment.
        3. Suggest SPECIFIC foods or types of meals for the remaining calories to hit nutrient goals.
        4. Mention any missing micronutrients if obvious.

        Output Format: clearly formatted Markdown. Keep it concise (under 150 words). Language: Vietnamese.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting advice:', error);
        return 'Xin lỗi, AI đang bận. Vui lòng thử lại sau.';
    }
}
