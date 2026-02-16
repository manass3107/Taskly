import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  const fetchOffers = useCallback(async (token) => {
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
  }, [taskId, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOffers(token);
  }, [navigate, fetchOffers]);

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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading offers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Offers for this Task
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
                {error}
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-xl">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                {message}
              </div>
            </div>
          </div>
        )}

        {/* Offers */}
        {offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No offers available for this task.</h3>
            <p className="text-gray-600">Check back later for new proposals.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-all"
              >
                {/* Freelancer Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {(offer.offeredBy?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {offer.offeredBy?.name || 'Unknown'}
                      </h3>
                      <p className="text-gray-600 text-sm">{offer.offeredBy?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ₹{offer.proposedFee}
                    </div>
                    <p className="text-gray-600 text-sm">Proposed Fee</p>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                  <h4 className="text-gray-900 font-semibold mb-3">Message:</h4>
                  <p className="text-gray-700 leading-relaxed">{offer.message}</p>
                </div>

                {/* Payment Terms */}
                <div className="mb-6">
                  <label className="block text-gray-900 font-semibold mb-3">
                    Payment Terms:
                  </label>
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:shadow-lg"
                    onClick={() => confirmAction(offer, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:shadow-lg"
                    onClick={() => confirmAction(offer, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedOffer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${actionType === 'accept'
                    ? 'bg-green-100'
                    : 'bg-red-100'
                  }`}>
                  {actionType === 'accept' ? (
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {actionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Rejection'}
                </h3>

                <p className="text-gray-600 mb-8">
                  Are you sure you want to{' '}
                  <strong>{actionType === 'accept' ? 'accept' : 'reject'}</strong> the offer from{' '}
                  <strong>{selectedOffer.offeredBy?.name || 'Unknown'}</strong>?
                </p>

                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all ${actionType === 'accept'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    onClick={handleConfirm}
                  >
                    Yes, {actionType === 'accept' ? 'Accept' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptOffer;