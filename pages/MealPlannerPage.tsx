
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../constants';
import { PlannedMeal } from '../types';

const MealPlannerPage: React.FC = () => {
  const { plannedMeals, removePlannedMeal, setSelectedRecipe } = useAppContext();

  const getWeekDays = () => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays();

  const getMealsForDate = (date: Date): PlannedMeal[] => {
    const dateString = date.toISOString().split('T')[0];
    return plannedMeals.filter(meal => meal.date === dateString).sort((a,b) => a.recipe.name.localeCompare(b.recipe.name));
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-on-surface mb-6">Meal Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekDays.map(day => {
          const meals = getMealsForDate(day);
          return (
            <div key={day.toISOString()} className="bg-surface rounded-lg shadow-md p-4 min-h-[200px]">
              <h2 className="font-bold text-on-surface text-center">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </h2>
              <p className="text-sm text-on-surface-secondary text-center mb-4">
                {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <div className="space-y-2">
                {meals.length > 0 ? (
                  meals.map(meal => (
                    <div key={meal.id} className="bg-gray-100 p-2 rounded-md text-sm group">
                      <div className="flex justify-between items-center">
                         <span 
                           onClick={() => setSelectedRecipe(meal.recipe)}
                           className="truncate cursor-pointer hover:text-primary transition-colors"
                           title={meal.recipe.name}
                         >
                            {meal.recipe.name}
                         </span>
                         <button onClick={() => removePlannedMeal(meal.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {ICONS.trash}
                         </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-400 mt-4">No meals planned.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlannerPage;
