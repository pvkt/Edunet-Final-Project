import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // <-- Make sure this file is imported

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
    } else {
      fetch('http://localhost:4000/user/profile', {
        method: 'GET',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUserData(data.user);
            setFormData(data.user);
          } else {
            localStorage.removeItem('auth-token');
            navigate('/login');
          }
        })
        .catch(() => {
          localStorage.removeItem('auth-token');
          navigate('/login');
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
    const body = {
      ...formData,
      pincode: parseInt(formData.pincode) || 0, // Convert string to number
    };
  
    fetch('http://localhost:4000/user/profile/update', {
      method: 'PUT',
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Profile updated successfully!');
        } else {
          alert('Failed to update profile.');
        }
      });
  };
  

  if (!userData) {
    return (
      <div className="loading-container">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2 className="profile-title">My Profile</h2>

        <label>Name</label>
        <input
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          readOnly
        />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />

        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender || ''}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
        />

        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode || ''}
          onChange={handleChange}
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
