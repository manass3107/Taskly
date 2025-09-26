import React, { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Available Tasks
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl p-4 text-center">
              {message}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl p-4 text-center">
              {error}
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tasks.map((task, index) => (
            <div 
              key={task._id} 
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {task.title}
              </h2>
              <p className="text-purple-200 mb-6 line-clamp-3">
                {task.description}
              </p>
              <div className="bg-black/20 rounded-xl p-4 mb-6">
                <p className="text-purple-300">
                  <span className="font-medium text-white">Participation Fee:</span> ₹{task.participationFee || 0}
                </p>
              </div>
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedTask(task)}
              >
                Offer on this task
              </button>
            </div>
          ))}
        </div>

        {/* Offer Form Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-2xl w-full mx-4 animate-modal-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Submit Offer
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-4"></div>
                <p className="text-purple-200">for: {selectedTask.title}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Proposed Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={proposedFee}
                    onChange={(e) => setProposedFee(Number(e.target.value))}
                    placeholder="Enter your proposed fee"
                    min="1"
                    required
                    className="w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-3 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={submitOffer}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                  >
                    Submit Offer
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
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
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Tasks Available</h3>
              <p className="text-purple-200">Check back later for new opportunities!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Offers;