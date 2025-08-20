import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const ContractCompletionButton = ({ contractId, allMilestonesComplete, taskPosterId, refreshTask }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const isTaskPoster = currentUserId === taskPosterId;
  const navigate = useNavigate();
  
  const handleCompleteContract = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to complete a contract.');
      return;
    }

    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/contracts/${contractId}/complete-contract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete contract');
      }

      setMessage('✅ Contract and Task marked as completed! Final payout processed.');
      refreshTask(); 
      navigate('/dashboard');

    } catch (err) {
      console.error('Error completing contract:', err);
      setError(`❌ ${err.message}`);
    }
  };

  if (!isTaskPoster) {
    return null; // Only show button for the task poster
  }

  return (
    <div className="mt-4">
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleCompleteContract}
        className={`px-4 py-2 rounded ${allMilestonesComplete ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
        disabled={!allMilestonesComplete}
      >
        {allMilestonesComplete ? 'Complete Contract' : 'Complete all milestones first'}
      </button>
    </div>
  );
};

export default ContractCompletionButton;