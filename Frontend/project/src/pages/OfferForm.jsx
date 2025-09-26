import React, { useState } from 'react';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const OfferForm = ({ taskId }) => {
  const [proposedFee, setProposedFee] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMsg('⚠️ Please login to apply an offer');
      return;
    }

    const role = localStorage.getItem('userRole');
    if (role !== 'worker') {
      setStatusMsg('⚠️ Only workers can apply to tasks.');
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
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
      <h3 className="text-3xl font-bold text-white mb-6">Submit Your Offer</h3>
      <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-8"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-purple-300 text-lg font-semibold mb-2">
            Proposed Fee (₹)
          </label>
          <input
            type="number"
            value={proposedFee}
            onChange={(e) => setProposedFee(e.target.value)}
            placeholder="Enter your proposed fee"
            className="w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-4 text-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-purple-300 text-lg font-semibold mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the client why you're the right fit for this task..."
            rows={5}
            className="w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 px-4 py-4 text-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300 resize-none"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
        >
          Apply Offer
        </button>

        {statusMsg && (
          <div className={`p-4 rounded-xl border font-semibold text-center transition-all duration-300 ${
            statusMsg.startsWith('✅') 
              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {statusMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default OfferForm;