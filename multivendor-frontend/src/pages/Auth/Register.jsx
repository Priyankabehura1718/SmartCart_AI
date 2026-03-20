// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      const d = err.response?.data;
      setError(d?.username?.[0] || d?.email?.[0] || d?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>
      <div className="auth-card card animate-fade-up">
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--accent)" />
            <path d="M8 10h6l3 8 3-10h6" stroke="#0A0C10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="24" r="2" fill="#0A0C10" />
          </svg>
          <span>NexusMarket</span>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join thousands of shoppers</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {[
            ['username', 'Username', 'text', 'your_username'],
            ['email', 'Email', 'email', 'you@example.com'],
            ['password', 'Password', 'password', '••••••••'],
            ['confirmPassword', 'Confirm Password', 'password', '••••••••'],
          ].map(([k, l, t, ph]) => (
            <div key={k} className="input-group">
              <label className="input-label">{l}</label>
              <input
                className="input"
                type={t}
                placeholder={ph}
                required
                value={form[k]}
                onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}