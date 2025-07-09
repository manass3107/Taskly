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

  if (error) return <p className="text-red-600 text-center mt-4">Error: {error}</p>;
  if (contracts.length === 0) return <p className="text-gray-400 text-center mt-4">No active contracts found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-300">My Contracts</h2>

      {contracts.map(contract => (
        <div
          key={contract._id}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 mb-6 shadow hover:shadow-lg transition"
        >
          <p><span className="font-semibold text-gray-300">Task:</span> {contract.taskTitle || 'Untitled Task'}</p>
          <p><span className="font-semibold text-gray-300">Status:</span> {(contract.status || 'Unknown')}</p>

          <div className="mt-4 space-y-3">
            {(contract.milestones || []).map((m, idx) => (
              <div key={idx} className="bg-[#2a2a2a] p-3 rounded border border-gray-600">
                <p><strong>Stage:</strong> {m.stage || `Stage ${idx + 1}`}</p>
                <p><strong>Description:</strong> {m.description || 'No description'}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  {m.completed
                    ? '✅ Completed'
                    : m.completionRequested
                    ? '🕒 Pending Approval'
                    : '⏳ Not requested'}
                </p>

                {!m.completed && !m.completionRequested && (
                  <button
                    onClick={() => requestMilestoneCompletion(contract._id, idx)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Request Completion
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyContracts;
