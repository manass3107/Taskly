import React, { useEffect, useState } from 'react';
import '../style/Wallet.css';
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

  if (loading) return <p className="text-white p-4">Loading wallet info...</p>;
  if (message && !user) return <p className="text-red-500 p-4">{message}</p>;
  if (!user) return <p className="text-white p-4">No wallet data found.</p>;
return (
  <div className="wallet-container">
    <h2 className="wallet-heading">💼 Wallet</h2>

    <div className="wallet-balance">
      <strong>Balance:</strong> ₹{user.walletBalance}
    </div>

    <div className="wallet-topup">
      <input
        type="number"
        placeholder="Enter top-up amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTopUp}>Top Up</button>
    </div>

    {message && (
      <p className={`wallet-message ${message.includes('✅') ? 'success' : 'error'}`}>
        {message}
      </p>
    )}

    <div className="transaction-list">
      <h3 className="text-lg font-semibold mb-2">📜 Transaction History</h3>
      {transactions.length === 0 ? (
        <p style={{ color: '#aaa' }}>No transactions yet.</p>
      ) : (
        transactions.map((tx, index) => (
          <div key={index} className={`transaction-item ${tx.type}`}>
            <div>
              <span className="type">{tx.type.toUpperCase()}</span> ₹{tx.amount} — {tx.reason}
            </div>
            <div className="date">{new Date(tx.date).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  </div>
);

};

export default Wallet;
