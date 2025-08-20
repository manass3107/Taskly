import React, { useState } from 'react';
import '../style/OfferForm.css'; // make sure to create this file or include in TaskDetail.css
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
    <form onSubmit={handleSubmit} className="offer-form">
      <input
        type="number"
        value={proposedFee}
        onChange={(e) => setProposedFee(e.target.value)}
        placeholder="Proposed fee"
        className="offer-input"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        className="offer-textarea"
      />
      <button type="submit" className="offer-button">
        Apply Offer
      </button>
      {statusMsg && (
        <div className={`status-message ${statusMsg.startsWith('✅') ? 'success' : 'error'}`}>
          {statusMsg}
        </div>
      )}
    </form>
  );
};

export default OfferForm;
