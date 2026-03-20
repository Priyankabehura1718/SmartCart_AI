// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1"/>
        <div className="auth-orb auth-orb--2"/>
      </div>
      <div className="auth-card card animate-fade-up">
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--accent)"/>
            <path d="M8 10h6l3 8 3-10h6" stroke="#0A0C10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="24" r="2" fill="#0A0C10"/>
          </svg>
          <span>NexusMarket</span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input className="input" type="text" placeholder="your_username" required
              value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))}/>
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-icon">
              <input className="input" type={show?'text':'password'} placeholder="••••••••" required
                value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
              <button type="button" className="auth-show-pw" onClick={()=>setShow(v=>!v)}>
                {show ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner"/> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
