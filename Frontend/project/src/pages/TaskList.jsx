import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";
console.log("TaskList component rendered");

const TaskList = ({ showMyTasks = false }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  console.log("Token:", token);
  console.log("showMyTasks value:", showMyTasks);

  if (!token && showMyTasks) {
    console.warn("No token found and showMyTasks is true. Redirecting to login.");
    window.location.href = '/login';
    return;
  }

  const fetchTasks = async () => {
    try {
      const url = showMyTasks? `${API_BASE}/api/tasks/my-tasks`: `${API_BASE}/api/tasks/open`;

      console.log("Fetching tasks from URL:", url);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log("Request headers:", headers);

      const res = await fetch(url, { headers });
      console.log("Response status:", res.status);

      if (res.status === 401) {
        setMessage('⚠️ Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => window.location.href = '/login', 1000);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      const data = await res.json();
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  fetchTasks();
}, [showMyTasks]);

  if (loading) return <p className="p-4">Loading tasks...</p>;

  return (
  <div className="task-list">
    {loading ? (
      <p className="loading">Loading tasks...</p>
    ) : tasks.length === 0 ? (
      <p className="no-tasks">{message}</p>
    ) : (
      <div className="task-grid">
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.description}</p>
            <p className="task-meta">
              <strong>Budget:</strong> ₹{task.budget}
            </p>
            <p className="task-meta">
              <strong>Status:</strong> {task.status}
            </p>
            <p className="task-meta">
              <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
            </p>
            <button
              className="view-details-btn"
              onClick={() => navigate(`/tasks/${task._id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
  );

};

export default TaskList;
