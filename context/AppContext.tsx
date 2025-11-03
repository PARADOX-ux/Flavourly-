import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Recipe, PlannedMeal, Page } from '../types';

interface AppContextType {
  user: User | null;
  page: Page;
  pantryItems: string[];
  favoriteRecipes: Recipe[];
  plannedMeals: PlannedMeal[];
  shoppingList: string[];
  selectedRecipe: Recipe | null;
  login: (user: User) => void;
  logout: () => void;
  setPage: (page: Page) => void;
  addPantryItem: (item: string) => void;
  removePantryItem: (item: string) => void;
  updatePantryItem: (oldItem: string, newItem: string) => void;
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: string) => boolean;
  addPlannedMeal: (recipe: Recipe, date: string) => void;
  removePlannedMeal: (mealId: string) => void;
  generateShoppingList: () => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  updateRecipeImage: (recipeId: string, newImageUrl: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('Home');
  const [pantryItems, setPantryItems] = useState<string[]>(['onions', 'tomatoes', 'ginger', 'garlic', 'potatoes', 'rice', 'turmeric powder', 'lentils']);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => {
    setUser(null);
    setPage('Home');
    setSelectedRecipe(null);
  };

  const addPantryItem = (item: string) => {
    if (item && !pantryItems.find(p => p.toLowerCase() === item.toLowerCase())) {
      setPantryItems(prev => [...prev, item.toLowerCase()]);
    }
  };

  const removePantryItem = (item: string) => {
    setPantryItems(prev => prev.filter(p => p !== item));
  };

  const updatePantryItem = (oldItem: string, newItem: string) => {
    const trimmedNewItem = newItem.trim();
    if (!trimmedNewItem) return;

    if (pantryItems.find(p => p.toLowerCase() === trimmedNewItem.toLowerCase() && p.toLowerCase() !== oldItem.toLowerCase())) {
        alert(`Pantry item "${trimmedNewItem}" already exists.`);
        return;
    }

    setPantryItems(prev => 
        prev.map(item => 
            item.toLowerCase() === oldItem.toLowerCase() ? trimmedNewItem : item
        )
    );
  };
  
  const toggleFavorite = (recipe: Recipe) => {
    setFavoriteRecipes(prev => 
      prev.find(r => r.id === recipe.id) 
      ? prev.filter(r => r.id !== recipe.id)
      : [...prev, recipe]
    );
  };
  
  const isFavorite = (recipeId: string) => favoriteRecipes.some(r => r.id === recipeId);

  const addPlannedMeal = (recipe: Recipe, date: string) => {
    const newMeal: PlannedMeal = { id: `${Date.now()}`, recipe, date };
    setPlannedMeals(prev => [...prev, newMeal]);
  };
  
  const removePlannedMeal = (mealId: string) => {
    setPlannedMeals(prev => prev.filter(m => m.id !== mealId));
  };

  const generateShoppingList = () => {
    const required = new Set<string>();
    plannedMeals.forEach(meal => {
      meal.recipe.requiredIngredients.forEach(ing => required.add(ing.toLowerCase()));
    });
    
    const pantrySet = new Set(pantryItems.map(item => item.toLowerCase()));
    const needed = Array.from(required).filter(item => !pantrySet.has(item));
    setShoppingList(needed);
  };
  
  useEffect(() => {
    generateShoppingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedMeals, pantryItems]);
  
  const updateRecipeImage = (recipeId: string, newImageUrl: string) => {
    setFavoriteRecipes(prev => 
      prev.map(r => r.id === recipeId ? { ...r, imageUrl: newImageUrl } : r)
    );
    setPlannedMeals(prev => 
      prev.map(m => m.recipe.id === recipeId ? { ...m, recipe: { ...m.recipe, imageUrl: newImageUrl } } : m)
    );
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe(prev => (prev ? { ...prev, imageUrl: newImageUrl } : null));
    }
  };

  const value = {
    user,
    page,
    pantryItems,
    favoriteRecipes,
    plannedMeals,
    shoppingList,
    selectedRecipe,
    login,
    logout,
    setPage,
    addPantryItem,
    removePantryItem,
    updatePantryItem,
    toggleFavorite,
    isFavorite,
    addPlannedMeal,
    removePlannedMeal,
    generateShoppingList,
    setSelectedRecipe,
    updateRecipeImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};