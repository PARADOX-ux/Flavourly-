import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the recipe." },
          description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
          instructions: { type: Type.STRING, description: "Step-by-step cooking instructions. Use newline characters for steps." },
          requiredIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of all ingredients required for the recipe.",
          },
          totalCalories: { type: Type.NUMBER, description: "Estimated total calories for the dish." },
          totalFat: { type: Type.NUMBER, description: "Estimated total fat in grams." },
          totalCarbs: { type: Type.NUMBER, description: "Estimated total carbohydrates in grams." },
          totalProtein: { type: Type.NUMBER, description: "Estimated total protein in grams." },
        },
        required: ["name", "description", "instructions", "requiredIngredients", "totalCalories", "totalFat", "totalCarbs", "totalProtein"],
      },
    },
  },
  required: ["recipes"],
};

export const generateRecipes = async (pantryItems: string[], cuisine: string, diet: string): Promise<Recipe[]> => {
  
  let prompt = `You are a creative chef specializing in Indian vegetarian cuisine.
Based on the ingredients I have in my pantry: [${pantryItems.join(', ')}].
`;

  if (cuisine && cuisine.toLowerCase() !== 'any') {
    prompt += `The recipe must be ${cuisine} style.\n`;
  }
  if (diet && diet.toLowerCase() !== 'any') {
    prompt += `The recipe must adhere to a ${diet} diet.\n`;
  }

  prompt += `Generate 5 unique and delicious Indian vegetarian recipes that I can make.
Prioritize recipes that heavily use the ingredients I already have.
For each recipe, provide all the required details as per the specified JSON schema.
Ensure the instructions are clear and easy to follow.
`;


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (parsedJson && parsedJson.recipes) {
        return parsedJson.recipes.map((recipe: Omit<Recipe, 'id' | 'imageUrl'>, index: number) => ({
            ...recipe,
            id: `${Date.now()}-${index}`,
            imageUrl: `https://picsum.photos/seed/${encodeURIComponent(recipe.name)}/500/300`,
        }));
    } else {
        console.error("Unexpected JSON structure:", parsedJson);
        return [];
    }

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. Please check your API key and try again.");
  }
};