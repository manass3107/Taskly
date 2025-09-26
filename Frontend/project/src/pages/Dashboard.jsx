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

      // Store new user + token
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);

      alert(`Switched to ${newRole}`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-white rounded-full animate-pulse"></div>
        </div>
        <p className="text-white text-xl font-semibold">Loading dashboard...</p>
      </div>
    </div>
  );

  if (message) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-8 py-6 rounded-2xl backdrop-blur-sm max-w-md">
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );

  if (!user || !analytics) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
        <p className="text-white text-center">No data available</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome, {user.name}!
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{user.name}</h3>
              <p className="text-purple-300 mb-4">{user.email}</p>
              
              <div className="flex items-center justify-center mb-4">
                <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                  user.role === 'worker' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {user.role === 'worker' ? '👨‍💻 Freelancer' : '📋 Client'}
                </span>
              </div>

              <button 
                onClick={handleRoleSwitch} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Switch to {user.role === 'worker' ? 'Client' : 'Freelancer'}
              </button>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Wallet Balance</h3>
              <p className="text-3xl font-bold text-green-400 mb-4">₹{user.walletBalance}</p>
              <button 
                onClick={() => navigate("/wallet")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Manage Wallet
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate("/create-task")}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
                >
                  Create Task
                </button>
                <button 
                  onClick={() => navigate("/tasks")}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
                >
                  View Tasks
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">Analytics Overview</h3>
              <p className="text-purple-300">Your performance metrics and statistics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.taskCount}</p>
              <p className="text-purple-300 text-sm">Tasks Posted</p>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.offerCount}</p>
              <p className="text-purple-300 text-sm">Offers Made</p>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.acceptedOffers}</p>
              <p className="text-purple-300 text-sm">Offers Accepted</p>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-green-400">₹{analytics.totalEarned}</p>
              <p className="text-purple-300 text-sm">Total Earned</p>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-red-400">₹{analytics.totalSpent}</p>
              <p className="text-purple-300 text-sm">Total Spent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;