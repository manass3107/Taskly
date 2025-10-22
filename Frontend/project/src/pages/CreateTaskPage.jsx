import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-8 py-6 rounded-2xl backdrop-blur-sm max-w-md">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold">!</span>
          </div>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="create-task-container min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create a New Task
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          <p className="text-purple-200 mt-4 text-lg">Post your project and find the perfect freelancer</p>
        </div>

        <div className="create-task-card bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
          <form onSubmit={handleSubmit} className="create-task-form space-y-8">
            
            {/* Title */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-purple-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your project title..."
                className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-purple-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project requirements..."
                rows={6}
                className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300 resize-none"
              />
            </div>

            {/* Budget and Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-purple-300">Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="10000"
                  className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-semibold text-purple-300">Participation Fee (₹)</label>
                <input
                  type="number"
                  value={participationFee}
                  onChange={(e) => setParticipationFee(e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Component Type and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-purple-300">Component Type</label>
                <input
                  type="text"
                  value={componentType}
                  onChange={(e) => setComponentType(e.target.value)}
                  placeholder="e.g. Backend, Frontend, Database,Deployment,Full Stack"
                  className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-semibold text-purple-300">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30"
            >
              🚀 Create Task
            </button>

            {/* Info Panel */}
            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="text-blue-200 font-medium mb-2">Tips for creating a great task:</p>
                  <ul className="text-blue-300 space-y-1">
                    <li>• Be specific about your requirements</li>
                    <li>• Set a realistic budget and deadline</li>
                    <li>• Participation fee helps filter serious freelancers</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;