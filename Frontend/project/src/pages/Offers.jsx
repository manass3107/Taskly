import React, { useEffect, useState } from 'react';
import { FaTasks } from 'react-icons/fa';

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Tasks</h1>
        <p className="text-gray-600">Browse and submit offers for open tasks</p>
      </div>

      {/* Status Messages */}
      {message && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 text-green-700 border border-green-100 rounded-xl p-4 text-center">
            {message}
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {task.title}
            </h2>
            <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
              {task.description}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Participation Fee</span>
                <span className="font-bold text-gray-900">₹{task.participationFee || 0}</span>
              </div>
            </div>
            <button
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all"
              onClick={() => setSelectedTask(task)}
            >
              Submit Offer
            </button>
          </div>
        ))}
      </div>

      {/* Offer Form Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Submit Offer
              </h2>
              <p className="text-gray-600">for: {selectedTask.title}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Proposed Fee (₹)
                </label>
                <input
                  type="number"
                  value={proposedFee}
                  onChange={(e) => setProposedFee(Number(e.target.value))}
                  placeholder="Enter your proposed fee"
                  min="1"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={submitOffer}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
                >
                  Submit Offer
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaTasks className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Tasks Available</h3>
            <p className="text-gray-600">Check back later for new opportunities!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;