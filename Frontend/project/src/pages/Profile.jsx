import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    axios.get('/api/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setProfile(res.data))
    .catch(err => {
      console.error('Failed to fetch profile', err);
      setError('Failed to load profile');
    });
  }, []);

  if (error) return <p className="profile-error">{error}</p>;
  if (!profile) return <p className="profile-loading">Loading...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-heading">My Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Wallet Balance:</strong> ₹{profile.walletBalance}</p>
        <p><strong>Role:</strong> {profile.role || 'User'}</p>
      </div>
    </div>
  );
}

export default Profile;
