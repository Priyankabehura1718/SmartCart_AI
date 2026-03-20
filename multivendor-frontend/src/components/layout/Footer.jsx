import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="var(--accent)"/>
                <path d="M8 10h6l3 8 3-10h6" stroke="#0A0C10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="24" r="2" fill="#0A0C10"/>
              </svg>
              <span>Nexus<em>Market</em></span>
            </div>
            <p>India's smartest multivendor marketplace, powered by AI for a better shopping experience.</p>
            <div className="footer-badges">
              <span className="badge badge-accent">✦ AI-Powered</span>
              <span className="badge badge-success">✓ Verified Reviews</span>
            </div>
          </div>
          <div className="footer-col">
            <h5>Shop</h5>
            {['Electronics','Apparel','Books','Sports','Home & Kitchen'].map(c=>(
              <Link key={c} to={'/products?category='+c}>{c}</Link>
            ))}
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            {[['About Us','/about'],['Careers','/careers'],['Blog','/blog'],['Press','/press']].map(([l,h])=>(
              <Link key={l} to={h}>{l}</Link>
            ))}
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            {[['Help Center','/help'],['Returns','/returns'],['Track Order','/orders'],['Contact','/contact']].map(([l,h])=>(
              <Link key={l} to={h}>{l}</Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 NexusMarket. All rights reserved.</span>
          <div style={{display:'flex',gap:16}}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
