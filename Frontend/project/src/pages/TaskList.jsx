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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-2 border-pink-400/50 rounded-full animate-pulse"></div>
        </div>
        <p className="ml-4 text-purple-300 text-lg">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {tasks.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-6"></div>
          <p className="text-purple-300 text-xl">{message || 'No tasks available at the moment.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div 
              key={task._id} 
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {task.title}
                </h3>
                
                <p className="text-purple-200 line-clamp-3">
                  {task.description}
                </p>
                
                <div className="bg-black/20 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 text-sm font-medium">Budget:</span>
                    <span className="text-white font-semibold">₹{task.budget}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 text-sm font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      task.status === 'completed' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : task.status === 'in_progress'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        : task.status === 'open'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 text-sm font-medium">Deadline:</span>
                    <span className="text-white text-sm">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium py-3 px-4 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;