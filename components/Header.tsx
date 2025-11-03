
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';
import { ICONS } from '../constants';

const Header: React.FC = () => {
  const { page, setPage, setSelectedRecipe } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fix: Used React.ReactElement instead of JSX.Element to resolve namespace issue.
  const navItems: { name: Page; icon: React.ReactElement }[] = [
    { name: 'Home', icon: ICONS.home },
    { name: 'My Favorites', icon: ICONS.favorites },
    { name: 'Meal Planner', icon: ICONS.planner },
    { name: 'Shopping List', icon: ICONS.shoppingList },
    { name: 'Profile', icon: ICONS.profile },
  ];

  const handleNavClick = (newPage: Page) => {
    setSelectedRecipe(null);
    setPage(newPage);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-primary">Flavorly</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    page === item.name
                      ? 'bg-primary text-white'
                      : 'text-on-surface-secondary hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  page === item.name
                    ? 'bg-primary text-white'
                    : 'text-on-surface-secondary hover:bg-gray-200'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;