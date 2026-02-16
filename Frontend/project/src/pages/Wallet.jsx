import React, { useEffect, useState } from 'react';
import { FaWallet, FaPlus, FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const Wallet = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token || !userId) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user info
        const userRes = await fetch(`${API_BASE}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.status === 401) {
          handleSessionExpired();
          return;
        }

        if (!userRes.ok) {
          const data = await userRes.json();
          throw new Error(data.error || 'Failed to fetch user info');
        }

        const userData = await userRes.json();
        setUser(userData);

        // Fetch transactions
        const txRes = await fetch(`${API_BASE}/api/users/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!txRes.ok) throw new Error('Failed to fetch transactions');
        const txData = await txRes.json();
        setTransactions(txData);
      } catch (err) {
        console.error('Error:', err);
        setMessage(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleSessionExpired = () => {
    setMessage('⚠️ Session expired. Please login again.');
    localStorage.clear();
    setTimeout(() => (window.location.href = '/login'), 1000);
  };

  const handleTopUp = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage('❌ Please enter a valid amount');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Top-up failed');
      }

      const data = await res.json();
      setUser((prev) => ({ ...prev, walletBalance: data.walletBalance }));
      setMessage('✅ Top-up successful!');
      setAmount('');

      // Refresh transactions
      const txRes = await fetch(`${API_BASE}/api/users/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
    } catch (err) {
      console.error('Top-up error:', err);
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (message && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-6 text-center max-w-md">
          {message}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-gray-50 text-gray-600 border border-gray-200 rounded-xl p-6 text-center">
          <p>No wallet data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FaWallet className="text-green-600 text-xl" />
          <h2 className="text-lg font-semibold text-gray-700">Current Balance</h2>
        </div>
        <div className="text-5xl font-bold text-gray-900">
          ₹{user.walletBalance}
        </div>
      </div>

      {/* Top-up Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaPlus className="text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Add Money</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={handleTopUp}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all"
          >
            Top Up
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`text-center p-4 rounded-xl text-sm font-medium ${message.includes('✅')
            ? 'bg-green-50 text-green-700 border border-green-100'
            : message.includes('⚠️')
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-100'
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
          {message}
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaHistory className="text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit'
                        ? 'bg-green-100 text-green-600'
                        : tx.type === 'debit'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                      {tx.type === 'credit' ? <FaArrowDown /> : <FaArrowUp />}
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${tx.type === 'credit'
                          ? 'bg-green-100 text-green-700'
                          : tx.type === 'debit'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                        {tx.type.toUpperCase()}
                      </span>
                      <p className="text-gray-600 text-sm mt-1">{tx.reason}</p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-gray-900 font-bold text-lg">₹{tx.amount}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;