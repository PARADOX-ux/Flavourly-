
import React from 'react';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../constants';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { setSelectedRecipe, toggleFavorite, isFavorite } = useAppContext();

  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={recipe.imageUrl} alt={recipe.name} />
        {recipe.matchPercentage !== undefined && (
          <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
            {recipe.matchPercentage.toFixed(0)}% Match
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-on-surface mb-2 truncate">{recipe.name}</h3>
        <p className="text-on-surface-secondary text-sm flex-grow mb-4 line-clamp-3">{recipe.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <button
            onClick={() => setSelectedRecipe(recipe)}
            className="text-primary hover:text-primary-focus font-semibold text-sm transition-colors"
          >
            View Recipe
          </button>
          <button onClick={() => toggleFavorite(recipe)} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
