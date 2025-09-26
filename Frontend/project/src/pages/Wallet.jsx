import React, { useEffect, useState } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-2 border-pink-400/50 rounded-full animate-pulse"></div>
        </div>
        <p className="ml-4 text-purple-300 text-lg">Loading wallet info...</p>
      </div>
    );
  }

  if (message && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-6">
        <div className="bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl p-6 text-center">
          {message}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
          <p className="text-purple-300 text-lg">No wallet data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            💼 Wallet
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-500">
          <h3 className="text-3xl font-semibold text-purple-300 mb-4">Current Balance</h3>
          <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            ₹{user.walletBalance}
          </div>
        </div>

        {/* Top-up Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h3 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 text-center">
            Add Money
          </h3>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="number"
              placeholder="Enter top-up amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
            />
            <button 
              onClick={handleTopUp}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium py-3 px-8 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
            >
              Top Up
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`text-center p-4 rounded-xl border ${
            message.includes('✅') 
              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
              : message.includes('⚠️')
              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {message}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h3 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-3">
            📜 Transaction History
          </h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-purple-300 text-lg">No transactions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div 
                  key={index} 
                  className="bg-black/20 rounded-xl p-6 hover:bg-black/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        tx.type === 'credit' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : tx.type === 'debit'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                      <span className="text-white font-semibold text-lg">
                        ₹{tx.amount}
                      </span>
                      <span className="text-purple-200">
                        — {tx.reason}
                      </span>
                    </div>
                    <div className="text-purple-300 text-sm">
                      {new Date(tx.date).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;