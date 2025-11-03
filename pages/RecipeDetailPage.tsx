import React, { useState, useRef } from 'react';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../constants';
import Modal from '../components/Modal';

interface RecipeDetailPageProps {
  recipe: Recipe;
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ recipe }) => {
  const { setSelectedRecipe, toggleFavorite, isFavorite, addPlannedMeal, pantryItems, updateRecipeImage } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddToPlan = () => {
    addPlannedMeal(recipe, selectedDate);
    setIsModalOpen(false);
    // Maybe show a toast notification here
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateRecipeImage(recipe.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const pantrySet = new Set(pantryItems.map(i => i.toLowerCase()));

  return (
    <div>
      <button onClick={() => setSelectedRecipe(null)} className="flex items-center gap-2 text-primary hover:text-primary-focus mb-6 font-semibold">
        {ICONS.back}
        <span>Back to Recipes</span>
      </button>

      <div className="bg-surface rounded-lg shadow-xl overflow-hidden">
        <div className="relative group">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 sm:h-80 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex justify-center items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-on-surface font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              {ICONS.upload}
              Upload Image
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />

        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface">{recipe.name}</h1>
            <button onClick={() => toggleFavorite(recipe)} className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-on-surface-secondary">{recipe.description}</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <button onClick={() => setIsModalOpen(true)} className="bg-secondary hover:bg-secondary-focus text-white font-bold py-2 px-4 rounded-lg transition-colors">Add to Meal Plan</button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold border-b-2 border-primary pb-2 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.requiredIngredients.map((ing, i) => (
                  <li key={i} className={`flex items-center gap-2 ${pantrySet.has(ing.toLowerCase()) ? 'text-green-600' : 'text-on-surface'}`}>
                     <span className={`w-2 h-2 rounded-full ${pantrySet.has(ing.toLowerCase()) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {ing}
                  </li>
                ))}
              </ul>
              
              <h2 className="text-2xl font-semibold border-b-2 border-primary pb-2 mt-8 mb-4">Nutrition</h2>
              <div className="space-y-2 text-on-surface-secondary">
                  <p><strong>Calories:</strong> {recipe.totalCalories} kcal</p>
                  <p><strong>Fat:</strong> {recipe.totalFat}g</p>
                  <p><strong>Carbs:</strong> {recipe.totalCarbs}g</p>
                  <p><strong>Protein:</strong> {recipe.totalProtein}g</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold border-b-2 border-primary pb-2 mb-4">Instructions</h2>
              <div className="prose max-w-none text-on-surface">
                {recipe.instructions.split('\n').map((step, i) => (
                  step.trim() && <p key={i}>{step}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Meal Plan">
        <div className="space-y-4">
            <p>Select a date to add "{recipe.name}" to your meal plan.</p>
            <input 
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button onClick={handleAddToPlan} className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg">Confirm</button>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeDetailPage;