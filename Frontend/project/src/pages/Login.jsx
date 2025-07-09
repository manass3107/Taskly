import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // ✅ Store both token and full user object
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redirect only once — remove window.location.href
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="container center-screen">
      <form onSubmit={handleSubmit} className="card form-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
          Don’t have an account? <a href="/signup" className="link">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
