import React, { useState } from 'react';
import { FaMoneyBillWave, FaEdit } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const OfferForm = ({ taskId }) => {
  const [proposedFee, setProposedFee] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMsg('⚠️ Please login to apply an offer');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/offers/${taskId}/apply-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          proposedFee: Number(proposedFee),
          message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply offer');

      setStatusMsg('✅ Offer applied successfully!');
      setProposedFee('');
      setMessage('');
    } catch (err) {
      setStatusMsg(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Proposed Fee
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-4 text-gray-400">
              <FaMoneyBillWave />
            </div>
            <input
              type="number"
              value={proposedFee}
              onChange={(e) => setProposedFee(e.target.value)}
              placeholder="Enter amount in ₹"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Message <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Briefly explain why you're the right fit for this project..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
        </button>

        {statusMsg && (
          <div className={`p-3 rounded-lg text-sm font-medium text-center ${statusMsg.startsWith('✅')
            ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
            {statusMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default OfferForm;