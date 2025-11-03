
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../constants';

const ProfilePage: React.FC = () => {
  const { user, logout, pantryItems, favoriteRecipes, plannedMeals } = useAppContext();

  if (!user) {
    return null; 
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Profile</h1>
      <div className="bg-surface p-8 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-shrink-0 w-24 h-24 bg-primary text-white flex items-center justify-center rounded-full text-4xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h2 className="text-2xl font-bold text-on-surface">{user.name}</h2>
            <p className="text-on-surface-secondary">{user.email}</p>
            <button
              onClick={logout}
              className="mt-4 inline-flex items-center gap-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              {ICONS.logout}
              Logout
            </button>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-on-surface">Your Flavorly Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-primary">{pantryItems.length}</p>
                    <p className="text-sm text-on-surface-secondary">Pantry Items</p>
                </div>
                 <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-secondary">{favoriteRecipes.length}</p>
                    <p className="text-sm text-on-surface-secondary">Favorite Recipes</p>
                </div>
                 <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-500">{plannedMeals.length}</p>
                    <p className="text-sm text-on-surface-secondary">Meals Planned</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
