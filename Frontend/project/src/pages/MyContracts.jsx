import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileContract, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-6 py-4 text-center">
        Error: {error}
      </div>
    </div>
  );

  if (contracts.length === 0) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-blue-50 text-blue-600 border border-blue-100 rounded-xl px-8 py-6 text-center">
        <FaFileContract className="mx-auto text-3xl mb-2" />
        <p>No active contracts found.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Contracts</h1>
        <p className="text-gray-600">Manage your active project contracts</p>
      </div>

      <div className="space-y-6">
        {contracts.map(contract => (
          <div
            key={contract._id}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Task</p>
                  <p className="text-2xl font-bold text-gray-900">{contract.taskTitle || 'Untitled Task'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${contract.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' :
                    contract.status?.toLowerCase() === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {contract.status || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Milestones</h3>
              {(contract.milestones || []).map((m, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Stage {idx + 1}</p>
                        <p className="text-lg font-semibold text-gray-900">{m.stage || `Milestone ${idx + 1}`}</p>
                        {m.description && (
                          <p className="text-gray-600 text-sm mt-1">{m.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {m.completed ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            <FaCheckCircle /> Completed
                          </span>
                        ) : m.completionRequested ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                            <FaClock /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                            <FaTimes /> Not Requested
                          </span>
                        )}
                      </div>
                    </div>

                    {!m.completed && !m.completionRequested && (
                      <button
                        onClick={() => requestMilestoneCompletion(contract._id, idx)}
                        className="w-full bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all text-sm"
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
  );
}

export default MyContracts;