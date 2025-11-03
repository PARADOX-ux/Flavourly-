
import React from 'react';
import { useAppContext } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

const FavoritesPage: React.FC = () => {
  const { favoriteRecipes } = useAppContext();

  return (
    <div>
      <h1 className="text-3xl font-bold text-on-surface mb-6">My Favorite Recipes</h1>
      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-surface rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-on-surface">No Favorites Yet!</h3>
            <p className="text-on-surface-secondary mt-2">Find recipes you love and click the heart icon to save them here.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
