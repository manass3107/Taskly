import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Optional: check if user is already logged in
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save full user object
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        navigate('/dashboard');
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="center-screen">
      <form onSubmit={handleSubmit} className="form-card">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="role" style={{ marginTop: "10px" }}>Select Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select role</option>
          <option value="worker">Worker</option>
          <option value="poster">Poster</option>
        </select>

        <button type="submit">Sign Up</button>

        <p className="mt-2 text-sm">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
