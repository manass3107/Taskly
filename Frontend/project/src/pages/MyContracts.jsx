import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchContracts(token);
  }, [navigate]);

  const fetchContracts = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/contracts/my-contracts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch contracts');
      }
      const data = await res.json();
      setContracts(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const requestMilestoneCompletion = async (contractId, milestoneIndex) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/contracts/${contractId}/milestones/${milestoneIndex}/request-completion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to request milestone completion');
      }

      alert('✅ Milestone completion requested');
      fetchContracts(token); // Refresh

    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl px-6 py-4 text-center">
        Error: {error}
      </div>
    </div>
  );
  
  if (contracts.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl px-6 py-4 text-center">
        No active contracts found.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Contracts
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {contracts.map(contract => (
            <div
              key={contract._id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
            >
              <div className="mb-6">
                <p className="text-xl mb-2">
                  <span className="font-semibold text-purple-300">Task:</span>{' '}
                  <span className="text-white">{contract.taskTitle || 'Untitled Task'}</span>
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-purple-300">Status:</span>{' '}
                  <span className="text-white">{contract.status || 'Unknown'}</span>
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white mb-4">Milestones</h3>
                {(contract.milestones || []).map((m, idx) => (
                  <div key={idx} className="bg-black/20 rounded-xl p-6 border border-white/10">
                    <div className="space-y-3">
                      <p className="text-lg">
                        <strong className="text-purple-300">Stage:</strong>{' '}
                        <span className="text-white">{m.stage || `Stage ${idx + 1}`}</span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-purple-300">Description:</strong>{' '}
                        <span className="text-purple-200">{m.description || 'No description'}</span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-purple-300">Status:</strong>{' '}
                        <span className={`font-semibold ${
                          m.completed 
                            ? 'text-green-300' 
                            : m.completionRequested 
                            ? 'text-yellow-300' 
                            : 'text-purple-200'
                        }`}>
                          {m.completed
                            ? '✅ Completed'
                            : m.completionRequested
                            ? '🕒 Pending Approval'
                            : '⏳ Not requested'}
                        </span>
                      </p>

                      {!m.completed && !m.completionRequested && (
                        <button
                          onClick={() => requestMilestoneCompletion(contract._id, idx)}
                          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                        >
                          Request Completion
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyContracts;