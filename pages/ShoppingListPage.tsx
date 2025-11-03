
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../constants';

const ShoppingListPage: React.FC = () => {
  const { shoppingList, generateShoppingList } = useAppContext();

  useEffect(() => {
    generateShoppingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-on-surface">Shopping List</h1>
        <button
          onClick={generateShoppingList}
          className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-focus transition-colors"
        >
          Refresh List
        </button>
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        {shoppingList.length > 0 ? (
          <ul className="space-y-4">
            {shoppingList.sort().map((item, index) => (
              <li key={index} className="flex items-center gap-4 p-3 border-b border-gray-200">
                <input type="checkbox" className="h-5 w-5 rounded text-primary focus:ring-primary" />
                <span className="capitalize text-on-surface">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <div className="text-secondary mx-auto h-12 w-12">{ICONS.shoppingList}</div>
            <h3 className="mt-2 text-xl font-semibold text-on-surface">Your Shopping List is Empty!</h3>
            <p className="mt-1 text-on-surface-secondary">
              Add some meals to your meal planner, and we'll tell you what you need to buy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
