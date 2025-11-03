
import React from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import MealPlannerPage from './pages/MealPlannerPage';
import ShoppingListPage from './pages/ShoppingListPage';
import ProfilePage from './pages/ProfilePage';
import RecipeDetailPage from './pages/RecipeDetailPage';

const App: React.FC = () => {
  const { page, user, selectedRecipe } = useAppContext();

  const renderPage = () => {
    if (!user) {
      return <AuthPage />;
    }
    if (selectedRecipe) {
      return <RecipeDetailPage recipe={selectedRecipe} />;
    }
    switch (page) {
      case 'Home':
        return <HomePage />;
      case 'My Favorites':
        return <FavoritesPage />;
      case 'Meal Planner':
        return <MealPlannerPage />;
      case 'Shopping List':
        return <ShoppingListPage />;
      case 'Profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && <Header />}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;