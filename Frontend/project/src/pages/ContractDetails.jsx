import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MilestoneActions from './MilestoneActions';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function ContractDetails() {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');

  const fetchContract = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/contracts/view/${contractId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch contract');
      }
      const data = await res.json();
      setContract(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [contractId]);

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

  if (!contract) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-white rounded-full animate-pulse"></div>
        </div>
        <p className="text-white text-xl font-semibold">Loading contract details...</p>
      </div>
    </div>
  );

  return (
    <div className="contract-details-container min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="title text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📄 Contract Details
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        <div className="card bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8 hover:bg-white/15 transition-all duration-500">
          <div className="mb-6 p-6 bg-black/20 rounded-xl">
            <div className="flex items-center mb-3">
              <span className="text-purple-400 text-2xl mr-3">📝</span>
              <h3 className="text-xl font-semibold text-purple-300">Task Title</h3>
            </div>
            <p className="text-3xl font-bold text-white">{contract.taskId.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <span className="text-green-400 text-xl mr-2">📌</span>
                <h4 className="font-semibold text-white">Status</h4>
              </div>
              <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                contract.status === 'active' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {contract.status}
              </span>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <span className="text-blue-400 text-xl mr-2">👤</span>
                <h4 className="font-semibold text-white">Assigned To</h4>
              </div>
              <p className="text-lg font-bold text-blue-300">{contract.acceptedOffer.offeredBy.name}</p>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <span className="text-yellow-400 text-xl mr-2">💰</span>
                <h4 className="font-semibold text-white">Payment</h4>
              </div>
              <p className="text-2xl font-bold text-green-400">₹{contract.acceptedOffer.amount}</p>
            </div>

            <div className="bg-black/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <span className="text-orange-400 text-xl mr-2">🗓️</span>
                <h4 className="font-semibold text-white">Deadline</h4>
              </div>
              <p className="text-lg font-semibold text-orange-300">
                {new Date(contract.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="milestone-section">
          <div className="flex items-center mb-8">
            <span className="text-yellow-400 text-3xl mr-4">🚧</span>
            <div>
              <h3 className="section-title text-3xl font-bold text-white">Milestones</h3>
              <p className="text-purple-300 mt-1">Project progress and deliverables</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <MilestoneActions
              contractId={contract._id}
              milestones={contract.milestones}
              taskPosterId={contract.taskId.postedBy._id}
              refreshTask={fetchContract}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractDetails;