import React, { useState, useEffect } from 'react';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function Signup() {
  // const navigate = useNavigate();
  const navigate = (path) => {
    // Mock navigation for artifact - replace with actual useNavigate() in your app
    console.log(`Navigating to: ${path}`);
    window.location.href = path;
  };
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        navigate('/dashboard');
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Sign Up
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-4"></div>
          <p className="text-purple-200">Join Taskly and start your journey</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500 animate-slide-up">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a secure password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-white font-medium mb-2">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                </svg>
                Select Your Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-white/20 rounded-xl text-white px-4 py-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300 [&>option]:bg-slate-800 [&>option]:text-white"
              >
                <option value="" disabled className="text-purple-300">Choose your role...</option>
                <option value="worker">🔧 Worker - Complete tasks and earn</option>
                <option value="poster">📋 Poster - Post tasks and hire workers</option>
              </select>
            </div>

            {/* Role Description Cards */}
            {form.role && (
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                {form.role === 'worker' && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-cyan-300 font-medium mb-1">Worker Account</h3>
                    <p className="text-purple-200 text-sm">Browse available tasks, submit offers, and earn money by completing work.</p>
                  </div>
                )}
                {form.role === 'poster' && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-pink-300 font-medium mb-1">Poster Account</h3>
                    <p className="text-purple-200 text-sm">Create tasks, review offers from workers, and manage your projects efficiently.</p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-purple-600 disabled:to-pink-600 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-white/10">
              <p className="text-purple-200">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-purple-400 hover:text-pink-400 font-medium transition-colors duration-300 hover:underline"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-purple-400 hover:text-pink-400 transition-colors duration-300">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-purple-400 hover:text-pink-400 transition-colors duration-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;