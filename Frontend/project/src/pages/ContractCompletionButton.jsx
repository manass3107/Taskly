import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const ContractCompletionButton = ({ contractId, allMilestonesComplete, taskPosterId, refreshTask }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const isTaskPoster = currentUserId === taskPosterId;
  const navigate = () => {};
  
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
    return null; 
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-sm rounded-2xl border border-white/10">
      {/* Messages */}
      {message && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-100 rounded-xl backdrop-blur-sm animate-slide-down">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold">{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 text-red-100 rounded-xl backdrop-blur-sm animate-slide-down">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Progress Status */}
      <div className="mb-6 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-white">Contract Status</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            allMilestonesComplete 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
          }`}>
            {allMilestonesComplete ? '✅ Ready to Complete' : '⏳ In Progress'}
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2 mr-4">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                allMilestonesComplete 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 w-3/4'
              }`}
            ></div>
          </div>
          <span className="text-sm text-purple-300 font-medium">
            {allMilestonesComplete ? '100%' : '75%'}
          </span>
        </div>
        
        <p className="text-purple-200 text-sm">
          {allMilestonesComplete 
            ? 'All milestones completed! Ready for final contract completion.'
            : 'Complete all project milestones before finalizing the contract.'
          }
        </p>
      </div>

      {/* Main Button */}
      <button
        onClick={handleCompleteContract}
        disabled={!allMilestonesComplete}
        className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center ${
          allMilestonesComplete
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/30 cursor-pointer'
            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
        }`}
      >
        {allMilestonesComplete ? (
          <>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete Contract
          </>
        ) : (
          <>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete all milestones first
          </>
        )}
      </button>

      {/* Info Section */}
      {allMilestonesComplete && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-fade-in">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-200 font-medium mb-1">Final Contract Completion</p>
              <p className="text-blue-300 leading-relaxed">
                This will mark the project as completed, release final payment to the freelancer, and close the contract permanently.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContractCompletionButton;