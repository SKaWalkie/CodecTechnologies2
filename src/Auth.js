import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

/**
 * Authentication page. Since Firebase has been removed, this page
 * prompts the user for their name and stores it in localStorage.
 * Once a name is provided, the user is considered "logged in" and
 * redirected to the main application. If the user is already
 * authenticated (a valid auth object exists in localStorage), they
 * will be redirected immediately without seeing this form.
 */
export const Auth = () => {
  const [nameInput, setNameInput] = useState('');
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const usersKey = 'budgetbuddy_users';

  // Redirect authenticated users to the home page
  useEffect(() => {
    if (isAuth) {
      navigate('/app');
    }
  }, [isAuth, navigate]);

  const handleLogin = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    let users = [];
    const storedUsers = localStorage.getItem(usersKey);
    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch (e) {
        console.error('Failed to parse user registry from localStorage', e);
      }
    }

    const normalizedName = trimmedName.toLowerCase();
    const existingUser = users.find(
      (user) => String(user.name || '').trim().toLowerCase() === normalizedName
    );

    const userID = existingUser ? existingUser.userID : Date.now().toString();
    if (!existingUser) {
      users.push({
        name: trimmedName,
        userID,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(usersKey, JSON.stringify(users));
    }

    const authInfo = {
      name: trimmedName,
      userID,
      photo: null,
      isAuth: true,
    };
    localStorage.setItem('auth', JSON.stringify(authInfo));
    navigate('/app');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && nameInput.trim()) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden flex items-center justify-center px-4">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8 shadow-2xl">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-blue-500 rounded-t-3xl"></div>
            
            {/* Logo and branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-amber-500 shadow-lg mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-blue-100 to-amber-300 bg-clip-text text-transparent mb-2">
                Budget Buddy
              </h1>
              <p className="text-sm text-slate-400">Manage your finances with elegance</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 border-blue-500/30 text-slate-100 placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:bg-slate-800 transition-all shadow-lg focus:shadow-blue-500/20"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={!nameInput.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Continue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>

            {/* Features list */}
            <div className="mt-8 pt-8 border-t border-blue-500/20 space-y-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Features</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">→</span> Track income and expenses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">→</span> Automatic data saving
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">→</span> Elegant dark theme
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};