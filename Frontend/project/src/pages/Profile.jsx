import React, { useEffect, useState } from 'react';
import { FaUser, FaWallet, FaEdit, FaPlus, FaSignOutAlt } from 'react-icons/fa';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API || 'http://localhost:5000';

    fetch(`${API_BASE}/api/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile');
      });
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 text-center max-w-md">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and wallet</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
          <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide">
            {profile.role || 'User'}
          </span>
        </div>

        {/* Profile Info */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                  <FaUser />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium text-sm">Name</span>
                  <span className="text-gray-900 font-semibold">{profile.name}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium text-sm">Email</span>
                  <span className="text-gray-900 font-semibold text-sm break-all">{profile.email}</span>
                </div>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <FaWallet />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Wallet Balance</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Available Balance</p>
                <p className="text-4xl font-bold text-gray-900">₹{profile.walletBalance}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all">
                <FaEdit />
                Edit Profile
              </button>
              <button className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-all">
                <FaPlus />
                Add Funds
              </button>
            </div>

            {/* Logout Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
