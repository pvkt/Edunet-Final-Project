import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#_])[A-Za-z\d@#_]{8,18}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be 8-18 characters with 1 capital, 1 small, 1 number, and 1 symbol (@, #, _).');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:4000/user/changepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Password changed successfully!');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="settings-wrapper">
      <form className="settings-form" onSubmit={handleSubmit}>
        <h2>Change Password</h2>

        <label>Old Password</label>
        <input
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={handleChange}
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default Settings;
