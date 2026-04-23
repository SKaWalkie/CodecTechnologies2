import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

/**
 * Home component for the expense tracker. This component handles
 * displaying the user's transactions, calculating totals and
 * providing a form to add new entries. All data is stored in
 * localStorage, so the app continues to work offline without
 * external dependencies. The design uses Tailwind CSS classes
 * to provide a modern and responsive user interface.
 */
export const Home = () => {
  const { userID, name, isAuth } = useAuth();
  const navigate = useNavigate();
  const getTransactionsKey = (id) => `transactions_${id}`;

  // Transactions are loaded per user ID.
  const [transactions, setTransactions] = useState([]);

  // Form fields for new entry
  const [newExp, setNewExp] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newType, setNewType] = useState('Expense');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Totals state: balance, income and expense
  const [total, setTotal] = useState({ balance: 0, income: 0, expense: 0 });

  // Load transactions for the current user and migrate legacy global data when possible.
  useEffect(() => {
    if (!userID) {
      setTransactions([]);
      return;
    }

    const userTransactionsKey = getTransactionsKey(userID);
    const stored = localStorage.getItem(userTransactionsKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(Array.isArray(parsed) ? parsed : []);
        return;
      } catch (e) {
        console.error('Failed to parse user transactions from localStorage', e);
      }
    }

    const legacyStored = localStorage.getItem('transactions');
    if (!legacyStored) {
      setTransactions([]);
      return;
    }

    try {
      const legacyParsed = JSON.parse(legacyStored);
      if (!Array.isArray(legacyParsed)) {
        setTransactions([]);
        return;
      }

      const legacyForUser = legacyParsed.filter((t) => !t.userID || t.userID === userID);
      setTransactions(legacyForUser);
      localStorage.setItem(userTransactionsKey, JSON.stringify(legacyForUser));
    } catch (e) {
      console.error('Failed to parse legacy transactions from localStorage', e);
      setTransactions([]);
    }
  }, [userID]);

  // Recalculate totals whenever the transactions change
  useEffect(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      const amount = Number(t.price);
      if (t.type === 'Income') {
        income += amount;
      } else {
        expense += amount;
      }
    });
    setTotal({ balance: income - expense, income, expense });
  }, [transactions]);

  // Persist transactions to user-scoped localStorage on every change.
  useEffect(() => {
    if (!userID) return;
    localStorage.setItem(getTransactionsKey(userID), JSON.stringify(transactions));
  }, [transactions, userID]);

  // Add a new transaction to the list
  const handleAdd = () => {
    if (!newExp.trim() || !newPrice) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now().toString(),
        userID,
        exp: newExp.trim(),
        price: Number(newPrice),
        type: newType,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [...prev, newEntry]);
      setNewExp('');
      setNewPrice('');
      setNewType('Expense');
      setIsSubmitting(false);
    }, 300);
  };

  // Delete a transaction by its id
  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Sign the user out by clearing auth info and navigating to login
  const handleSignOut = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newExp.trim() && newPrice && !isSubmitting) {
      handleAdd();
    }
  };

  // Guard route: redirect unauthenticated users to the login page
  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-xl shadow-lg">
              💰
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-amber-300 bg-clip-text text-transparent">
              Budget Buddy
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {(name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-blue-100">{name}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-semibold text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/60"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Balance Card */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-green-500/20 hover:border-green-500/40 p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-green-300">Balance</p>
                <span className="text-2xl">⚖️</span>
              </div>
              <p className={`text-4xl font-bold ${total.balance >= 0 ? 'text-green-400' : 'text-amber-400'}`}>
                ₹{Math.abs(total.balance).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-3">
                {total.balance >= 0 ? 'Positive balance' : 'Budget deficit'}
              </p>
            </div>
          </div>

          {/* Income Card */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 hover:border-blue-500/40 p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-blue-300">Income</p>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-4xl font-bold text-blue-400">₹{total.income.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-3">
                {transactions.filter((t) => t.type === 'Income').length} transaction
                {transactions.filter((t) => t.type === 'Income').length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Expense Card */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-amber-500/20 hover:border-amber-500/40 p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-amber-300">Expenses</p>
                <span className="text-2xl">📉</span>
              </div>
              <p className="text-4xl font-bold text-amber-400">₹{total.expense.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-3">
                {transactions.filter((t) => t.type === 'Expense').length} expense
                {transactions.filter((t) => t.type === 'Expense').length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add entry form */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 p-8">
              <h2 className="text-xl font-bold text-blue-100 mb-6 flex items-center gap-2">
                <span>✨</span> Add Transaction
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Coffee"
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-500/30 focus:border-blue-400 focus:outline-none transition-all bg-slate-800/50 focus:bg-slate-800 text-slate-100 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg focus:shadow-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-500/30 focus:border-blue-400 focus:outline-none transition-all bg-slate-800/50 focus:bg-slate-800 text-slate-100 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg focus:shadow-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-3">Type</label>
                  <div className="flex gap-3">
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="type"
                        value="Expense"
                        checked={newType === 'Expense'}
                        onChange={(e) => setNewType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`px-4 py-3 text-sm text-center font-semibold rounded-lg cursor-pointer border-2 transition-all ${newType === 'Expense' ? 'border-amber-500/60 bg-amber-500/20 text-amber-300' : 'border-slate-600/50 bg-slate-800/30 text-slate-300 hover:border-amber-500/40'}`}>
                        Expense
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="type"
                        value="Income"
                        checked={newType === 'Income'}
                        onChange={(e) => setNewType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`px-4 py-3 text-sm text-center font-semibold rounded-lg cursor-pointer border-2 transition-all ${newType === 'Income' ? 'border-green-500/60 bg-green-500/20 text-green-300' : 'border-slate-600/50 bg-slate-800/30 text-slate-300 hover:border-green-500/40'}`}>
                        Income
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isSubmitting || !newExp.trim() || !newPrice}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">{isSubmitting ? 'Adding...' : 'Add Transaction'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Transactions list */}
          <div className="lg:col-span-2 group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 p-8">
              <h2 className="text-xl font-bold text-blue-100 mb-6 flex items-center gap-2">
                <span>📋</span> Recent Transactions
              </h2>
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-5xl mb-4">🎯</p>
                  <p className="text-slate-300 font-medium">No transactions yet</p>
                  <p className="text-slate-400 text-sm mt-1">Your financial journey starts here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {transactions.map((tran) => (
                    <div
                      key={tran.id}
                      className={`flex justify-between items-center py-4 px-4 rounded-lg border-l-4 transition-all hover:bg-slate-800/50 ${tran.type === 'Expense' ? 'bg-amber-500/10 border-amber-400 hover:border-amber-300' : 'bg-green-500/10 border-green-400 hover:border-green-300'}`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">{tran.exp}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(tran.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold ${tran.type === 'Expense' ? 'text-amber-400' : 'text-green-400'}`}>
                          {tran.type === 'Expense' ? '-' : '+'}₹{Number(tran.price).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDelete(tran.id)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
                          title="Delete transaction"
                        >
                          x
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
};