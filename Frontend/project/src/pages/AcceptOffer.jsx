import React, { useEffect, useState } from 'react';
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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-white rounded-full animate-pulse"></div>
        </div>
        <p className="text-white text-xl font-semibold animate-pulse">Loading offers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Offers for this Task
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-6 py-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">!</span>
                </div>
                {error}
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-8 animate-slide-down">
            <div className="bg-green-500/20 border border-green-500/50 text-green-100 px-6 py-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                {message}
              </div>
            </div>
          </div>
        )}

        {/* Offers */}
        {offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center opacity-50">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No offers available for this task.</h3>
          </div>
        ) : (
          <div className="grid gap-8">
            {offers.map((offer, index) => (
              <div
                key={offer._id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Freelancer Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {(offer.offeredBy?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        <strong>From:</strong> {offer.offeredBy?.name || 'Unknown'}
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-purple-300 ml-2 text-sm">5.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      <strong>Fee:</strong> ₹{offer.proposedFee}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-black/20 rounded-xl p-6 mb-6">
                  <h4 className="text-purple-300 font-semibold mb-3">
                    <strong>Message:</strong>
                  </h4>
                  <p className="text-white leading-relaxed">{offer.message}</p>
                </div>

                {/* Payment Terms */}
                <div className="mb-6">
                  <label className="block text-purple-300 font-semibold mb-3">
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
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30"
                    onClick={() => confirmAction(offer, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full animate-modal-in">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  actionType === 'accept' 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-br from-red-500 to-pink-500'
                }`}>
                  {actionType === 'accept' ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {actionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Rejection'}
                </h3>
                
                <p className="text-purple-200 mb-8">
                  Are you sure you want to{' '}
                  <strong>{actionType === 'accept' ? 'accept' : 'reject'}</strong> the offer from{' '}
                  <strong>{selectedOffer.offeredBy?.name || 'Unknown'}</strong>?
                </p>

                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                      actionType === 'accept'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
                    }`}
                    onClick={handleConfirm}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AcceptOffer;