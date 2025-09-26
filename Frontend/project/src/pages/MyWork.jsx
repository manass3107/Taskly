import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function MyWork() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/contracts/my-contracts`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setContracts(data);
    };
    fetchContracts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📁 My Ongoing Work
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {contracts.length === 0 ? (
          <div className="flex items-center justify-center mt-16">
            <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl px-8 py-6 text-center">
              <p className="text-lg">No ongoing work found.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {contracts.map((c) => {
              const total = c.milestones?.length || 0;
              const completed = c.milestones?.filter((m) => m.completed).length || 0;
              const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

              return (
                <div 
                  key={c._id} 
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Contract Header */}
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-bold text-white">{c.taskTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      c.status?.toLowerCase() === 'active' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      c.status?.toLowerCase() === 'completed' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      c.status?.toLowerCase() === 'pending' 
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {c.status || 'Unknown'}
                    </span>
                  </div>

                  {/* Deadline */}
                  {c.deadline && (
                    <p className="text-purple-200 mb-6 flex items-center">
                      <span className="mr-2">📅</span>
                      <span className="font-semibold text-purple-300">Deadline:</span>{' '}
                      {new Date(c.deadline).toLocaleDateString()}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="bg-black/30 rounded-full h-4 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-purple-300 text-sm mt-2 font-semibold">
                      {progressPercent}% complete ({completed}/{total} milestones)
                    </p>
                  </div>

                  {/* Milestones */}
                  {c.milestones && c.milestones.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-purple-300 mb-4">Milestones</h4>
                      <div className="bg-black/20 rounded-xl p-4 space-y-2">
                        {c.milestones.map((m, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center p-2 rounded-lg transition-all duration-300 ${
                              m.completed 
                                ? 'bg-green-500/10 border border-green-500/20' 
                                : 'bg-white/5 border border-white/10'
                            }`}
                          >
                            <span className={`mr-3 text-lg ${
                              m.completed ? 'text-green-400' : 'text-purple-400'
                            }`}>
                              {m.completed ? '✅' : '⏳'}
                            </span>
                            <span className={`${
                              m.completed ? 'text-green-300 line-through' : 'text-white'
                            }`}>
                              {m.title || m.stage || `Milestone ${idx + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link 
                    to={`/contract/${c._id}`} 
                    className="inline-block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-4 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyWork;