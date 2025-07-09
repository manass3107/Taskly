import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AcceptOffer.css';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function AcceptOffer() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' or 'reject'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOffers(token);
  }, [taskId, navigate]);

  const fetchOffers = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/offers/task/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        setError('⚠️ Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => navigate('/login'), 1000);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to fetch offers');
      }
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = (offer, type) => {
    setSelectedOffer(offer);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (actionType === 'accept') {
      handleAcceptOffer(selectedOffer._id);
    } else if (actionType === 'reject') {
      handleRejectOffer(selectedOffer._id);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedOffer(null);
    setActionType(null);
  };

  const handleAcceptOffer = async (offerId) => {
    if (!paymentTerms[offerId]) {
      setError('Please select payment terms before accepting the offer.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/offers/${offerId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentTerms: paymentTerms[offerId] })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message);
      }
      setMessage('✅ Offer accepted successfully');
      setOffers(offers.filter(o => o._id !== offerId));
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  const handleRejectOffer = async (offerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/offers/${offerId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message);
      }
      setMessage('❌ Offer rejected successfully');
      setOffers(offers.filter(o => o._id !== offerId));
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  if (loading) return <p>Loading offers...</p>;

  return (
    <div className="accept-offer-container">
      <h2>Offers for this Task</h2>
      {error && <p className="message-error">{error}</p>}
      {message && <p className="message-success">{message}</p>}
      {offers.length === 0 ? (
        <p>No offers available for this task.</p>
      ) : (
        offers.map(offer => (
          <div key={offer._id} className="offer-card">
            <p><strong>From:</strong> {offer.offeredBy?.name || 'Unknown'}</p>
            <p><strong>Fee:</strong> ₹{offer.proposedFee}</p>
            <p><strong>Message:</strong> {offer.message}</p>
            <label>
              Payment Terms:
              <input
                type="text"
                value={paymentTerms[offer._id] || ''}
                onChange={e =>
                  setPaymentTerms({
                    ...paymentTerms,
                    [offer._id]: e.target.value
                  })
                }
                placeholder="quarter / half / full"
              />
            </label>
            <div className="button-group">
              <button
                className="button-accept"
                onClick={() => confirmAction(offer, 'accept')}
              >
                Accept
              </button>
              <button
                className="button-reject"
                onClick={() => confirmAction(offer, 'reject')}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && selectedOffer && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{actionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Rejection'}</h3>
            <p>
              Are you sure you want to{' '}
              <strong>{actionType === 'accept' ? 'accept' : 'reject'}</strong> the offer from{' '}
              <strong>{selectedOffer.offeredBy?.name || 'Unknown'}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="button-confirm" onClick={handleConfirm}>Yes</button>
              <button className="button-cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcceptOffer;
