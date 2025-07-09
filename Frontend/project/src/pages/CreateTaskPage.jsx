import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTaskPage.css';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [participationFee, setParticipationFee] = useState('');
  const [componentType, setComponentType] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== 'poster') {
        setError('⛔ Only posters can create tasks.');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !budget || !participationFee || !componentType || !deadline) {
      alert('Please fill all fields!');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          participationFee: Number(participationFee),
          componentType,
          deadline
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Task creation failed');
      }

      alert('✅ Task created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error creating task:', err);
      alert(`❌ ${err.message}`);
    }
  };

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="create-task-container">
      <div className="create-task-card">
        <h2>Create a New Task</h2>
        <form onSubmit={handleSubmit} className="create-task-form">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Budget (₹)</label>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />

          <label>Participation Fee (₹)</label>
          <input type="number" value={participationFee} onChange={(e) => setParticipationFee(e.target.value)} />

          <label>Component Type</label>
          <input type="text" value={componentType} onChange={(e) => setComponentType(e.target.value)} />

          <label>Deadline</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

          <button type="submit">🚀 Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
