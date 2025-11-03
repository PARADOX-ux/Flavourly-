
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';

const AuthPage: React.FC = () => {
  const { login } = useAppContext();

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest123',
      name: 'Guest User',
      email: 'guest@flavorly.app',
    };
    login(guestUser);
  };

  return (
    <div className="flex items-center justify-center min-h-screen -m-8 bg-gray-100">
      <div className="p-8 bg-surface rounded-xl shadow-2xl text-center max-w-sm w-full">
        <h1 className="text-4xl font-bold text-primary mb-2">Flavorly</h1>
        <p className="text-on-surface-secondary mb-8">Your AI-Powered Meal Planning Assistant</p>
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
                Welcome! This is a demo application.
            </p>
            <button
                onClick={handleGuestLogin}
                className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
                Continue as Guest
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
