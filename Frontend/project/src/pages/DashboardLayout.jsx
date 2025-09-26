import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      console.log("⛔ No token or userId — redirecting");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);

        // Keep localStorage in sync
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("userName", res.data.name);
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userRole", res.data.role);
      } catch (err) {
        console.error("⚠️ Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;