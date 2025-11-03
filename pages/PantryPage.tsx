import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../constants';

const PantryPage: React.FC = () => {
  const { pantryItems, addPantryItem, removePantryItem, updatePantryItem } = useAppContext();
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-on-surface mb-6">My Pantry</h1>
      <div className="bg-surface p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g., Chickpeas, spinach..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors flex items-center gap-2">
            {ICONS.plus} Add
          </button>
        </form>
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-on-surface mb-4">
          Available Ingredients ({pantryItems.length})
        </h2>
        {pantryItems.length > 0 ? (
          <ul className="space-y-3">
            {pantryItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
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
          <p className="text-on-surface-secondary">Your pantry is empty. Add some ingredients to get started!</p>
        )}
      </div>
    </div>
  );
};

export default PantryPage;