import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MilestoneActions from './MilestoneActions';

const API_BASE = process.env.REACT_APP_API || "http://localhost:3000";

function ContractDetails() {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');

  const fetchContract = useCallback(async () => {
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
  }, [contractId]);

  useEffect(() => {
    fetchContract();
  }, [contractId, fetchContract]);

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-100 text-red-600 px-8 py-6 rounded-2xl max-w-md">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-600 font-bold">!</span>
          </div>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!contract) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading contract details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Contract Details
          </h2>
          <p className="text-gray-600">Manage project milestones and payments</p>
        </div>

        {/* Contract Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-8">
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Task Title</p>
            <h3 className="text-3xl font-bold text-gray-900">{contract.taskId.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${contract.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
                }`}>
                {contract.status}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Assigned To</p>
              <p className="text-lg font-bold text-gray-900">{contract.acceptedOffer.offeredBy.name}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Payment</p>
              <p className="text-2xl font-bold text-gray-900">₹{contract.acceptedOffer.proposedFee}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Deadline</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(contract.taskId.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Milestones</h3>
            <p className="text-gray-600">Project progress and deliverables</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
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