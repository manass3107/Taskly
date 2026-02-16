import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const TaskList = ({ showMyTasks = false }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token && showMyTasks) {
      window.location.href = '/login';
      return;
    }

    const fetchTasks = async () => {
      try {
        const url = showMyTasks ? `${API_BASE}/api/tasks/my-tasks` : `${API_BASE}/api/tasks/open`;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(url, { headers });

        if (res.status === 401) {
          setMessage('Session expired. Please login again.');
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
        console.error('Error fetching tasks:', err);
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [showMyTasks]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📭
          </div>
          <p className="text-gray-500 text-lg">{message || 'No tasks available at the moment.'}</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tasks.map(task => (
            <motion.div
              key={task._id}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${task.status === 'completed'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : task.status === 'in_progress'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                  {task.description}
                </p>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center text-gray-600 text-sm font-medium">
                    <FaMoneyBillWave className="mr-2 text-green-600" />
                    <span>₹{task.budget}</span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button
                className="mt-6 w-full py-2.5 px-4 bg-gray-50 hover:bg-black hover:text-white text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                View Details
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;