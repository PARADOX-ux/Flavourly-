
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: string;
  requiredIngredients: string[];
  imageUrl: string;
  totalCalories: number;
  totalFat: number;
  totalCarbs: number;
  totalProtein: number;
  matchPercentage?: number;
}

export interface PlannedMeal {
  id: string;
  recipe: Recipe;
  date: string; // Using string for simplicity, e.g., 'YYYY-MM-DD'
}

export type Page = 'Home' | 'Recipe Details' | 'My Favorites' | 'Meal Planner' | 'Shopping List' | 'Profile';