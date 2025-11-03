import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateRecipes } from '../services/geminiService';
import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import { ICONS } from '../constants';

const HomePage: React.FC = () => {
  const { user, pantryItems, addPantryItem, removePantryItem, updatePantryItem } = useAppContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [diet, setDiet] = useState('any');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const calculateMatchPercentage = useCallback((recipe: Recipe): number => {
    const pantrySet = new Set(pantryItems.map(item => item.toLowerCase()));
    const requiredSet = new Set(recipe.requiredIngredients.map(item => item.toLowerCase()));
    
    if (requiredSet.size === 0) return 100;
    
    let matchCount = 0;
    requiredSet.forEach(ingredient => {
      if (pantrySet.has(ingredient)) {
        matchCount++;
      }
    });
    
    return (matchCount / requiredSet.size) * 100;
  }, [pantryItems]);

  const handleFindRecipes = async () => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    try {
      const generated = await generateRecipes(pantryItems, cuisine, diet);
      const recipesWithMatch = generated
        .map(recipe => ({
          ...recipe,
          matchPercentage: calculateMatchPercentage(recipe),
        }))
        .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));
      setRecipes(recipesWithMatch);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      addPantryItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleStartEdit = (item: string) => {
    setEditingItem(item);
    setEditValue(item);
  };

  const handleCancelEdit = () => {
      setEditingItem(null);
      setEditValue('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingItem && editValue.trim()) {
          updatePantryItem(editingItem, editValue);
      }
      setEditingItem(null);
      setEditValue('');
  };


  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-on-surface">Welcome, {user?.name}!</h1>
        <p className="text-on-surface-secondary mt-1">Manage your pantry and find recipes to cook today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Pantry Section */}
        <div className="lg:col-span-1 bg-surface p-6 rounded-lg shadow-md lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-on-surface mb-4">My Pantry ({pantryItems.length})</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="e.g., Chickpeas"
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button type="submit" className="bg-primary text-white font-bold p-2 px-4 rounded-lg hover:bg-primary-focus transition-colors flex items-center justify-center">
              {ICONS.plus}
            </button>
          </form>
          {pantryItems.length > 0 ? (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {pantryItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  {editingItem === item ? (
                    <form onSubmit={handleSaveEdit} className="flex-grow flex gap-2 items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-grow p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Escape' && handleCancelEdit()}
                      />
                      <button type="submit" className="text-green-600 hover:text-green-800" aria-label="Save changes">
                          {ICONS.save}
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700" aria-label="Cancel edit">
                          {ICONS.cancel}
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="capitalize text-on-surface flex-grow">{item}</span>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          aria-label={`Edit ${item}`}
                        >
                          {ICONS.edit}
                        </button>
                        <button
                          onClick={() => removePantryItem(item)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label={`Remove ${item}`}
                        >
                          {ICONS.trash}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-on-surface-secondary text-sm">Your pantry is empty. Add some ingredients to get started!</p>
          )}
        </div>

        {/* Recipe Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Find Recipes</h2>
             <p className="text-on-surface-secondary mb-4">Select filters and discover recipes based on your pantry items.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="cuisine-filter" className="block text-sm font-medium text-on-surface-secondary">Cuisine</label>
                    <select
                        id="cuisine-filter"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                        <option value="any">Any</option>
                        <option value="North Indian">North Indian</option>
                        <option value="South Indian">South Indian</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Punjabi">Punjabi</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="diet-filter" className="block text-sm font-medium text-on-surface-secondary">Dietary Restriction</label>
                    <select
                        id="diet-filter"
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                        <option value="any">Any</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        <option value="Jain">Jain</option>
                    </select>
                </div>
            </div>

            <button 
              onClick={handleFindRecipes}
              disabled={isLoading || pantryItems.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {ICONS.search}
              {isLoading ? 'Finding Recipes...' : 'Find Recipes with My Pantry'}
            </button>
          </div>

          {isLoading && <Spinner />}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}
          
          {recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {recipes.length === 0 && !isLoading && !error && (
            <div className="text-center py-10 bg-surface rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-on-surface">Let's Get Cooking!</h3>
                <p className="text-on-surface-secondary mt-2">Add ingredients to your pantry, then find recipes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;