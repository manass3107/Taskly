import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWallet, FaBolt, FaChartLine, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      localStorage.clear();
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
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Role switching removed - all users can post and apply to tasks

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  if (message) return (
    <div className="p-4">
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100">
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );

  const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="card flex flex-col items-center justify-center text-center space-y-3"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="text-xl" />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{label}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <button
          onClick={() => navigate("/create-task")}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-full transition-all hover:-translate-y-1 hover:shadow-lg font-semibold"
        >
          <span>+ Create New Task</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Wallet Balance"
          value={`₹${user.walletBalance}`}
          icon={FaWallet}
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          label="Tasks Posted"
          value={analytics.taskCount}
          icon={FaBolt}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Offers Made"
          value={analytics.offerCount}
          icon={FaChartLine}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          label="Completed"
          value={analytics.acceptedOffers}
          icon={FaCheckCircle}
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Quick Actions / Role Specific Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile / Role Card */}
        <div className="card lg:col-span-1 border-stone-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm flex justify-between items-center group"
            >
              <span>View Profile</span>
              <FaArrowRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Recent Activity or Financials */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Financial Overview</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">Last 30 Days</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-green-600 text-sm font-medium mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-green-900">₹{analytics.totalEarned}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-600 text-sm font-medium mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-900">₹{analytics.totalSpent}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => navigate("/wallet")}
              className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1"
            >
              View Wallet Details <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;