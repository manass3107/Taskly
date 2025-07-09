import React, { useEffect, useState } from 'react';
import './Offers.css';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function Offers() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proposedFee, setProposedFee] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchTasks(token);
  }, []);

  const fetchTasks = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        setError('⚠️ Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => window.location.href = '/login', 1000);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(`❌ ${err.message}`);
    }
  };

  const submitOffer = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      setError('⚠️ You must be logged in.');
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/offers/${selectedTask._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          offeredBy: user._id,
          proposedFee
        })
      });

      const data = await res.json();

      if (res.status === 401) {
        setError('⚠️ Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => window.location.href = '/login', 1000);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offer');
      }

      setMessage('✅ Offer submitted successfully');
      setProposedFee(0);
      setSelectedTask(null);
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="offers-container">
      <h1>Available Tasks</h1>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="task-card">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p><strong>Participation Fee:</strong> ₹{task.participationFee || 0}</p>
            <button
              className="btn-primary"
              onClick={() => setSelectedTask(task)}
            >
              Offer on this task
            </button>
          </li>
        ))}
      </ul>

      {selectedTask && (
        <form onSubmit={submitOffer} className="offer-form">
          <h2>Submit Offer for: {selectedTask.title}</h2>
          <input
            type="number"
            value={proposedFee}
            onChange={(e) => setProposedFee(Number(e.target.value))}
            placeholder="Proposed Fee"
            min="1"
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn-success">Submit Offer</button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setSelectedTask(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Offers;
