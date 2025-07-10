import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      localStorage.clear(); // clean old data
      navigate("/login");   
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_BASE}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        const analyticsRes = await axios.get(`${API_BASE}/api/users/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Error:", err);
        localStorage.clear(); // clear broken session
        navigate("/login"); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRoleSwitch = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const newRole = user.role === 'worker' ? 'poster' : 'worker';

    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/switch-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to switch role');

      // ✅ Store new user + token
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);

      alert(`✅ Switched to ${newRole}`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  if (loading) return <div className="container"><div className="card"><p>Loading dashboard...</p></div></div>;
  if (message) return <div className="container"><div className="card error">{message}</div></div>;
  if (!user || !analytics) return <div className="container"><div className="card">No data available</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome, {user.name}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <button onClick={handleRoleSwitch} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
          Switch to {user.role === 'worker' ? 'Poster' : 'Worker'}
        </button>

        <p><strong>Wallet Balance:</strong> ₹{user.walletBalance}</p>

        <h3>📊 Analytics</h3>
        <ul>
          <li><strong>Total Tasks Posted:</strong> {analytics.taskCount}</li>
          <li><strong>Total Offers Made:</strong> {analytics.offerCount}</li>
          <li><strong>Offers Accepted:</strong> {analytics.acceptedOffers}</li>
          <li><strong>Total Earned:</strong> ₹{analytics.totalEarned}</li>
          <li><strong>Total Spent:</strong> ₹{analytics.totalSpent}</li>
        </ul>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/create-task")}>Create Task</button>
          <button onClick={() => navigate("/tasks")}>View Tasks</button>
          <button onClick={() => navigate("/wallet")}>Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
