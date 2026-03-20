// src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Recommendations from '../../components/ai/Recommendations';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics',    icon: '⚡', color: '#00E5CC', count: 1240 },
  { name: 'Apparel',        icon: '👗', color: '#F5C842', count: 3860 },
  { name: 'Books',          icon: '📚', color: '#A78BFA', count: 920  },
  { name: 'Sports',         icon: '🏃', color: '#3DDC84', count: 640  },
  { name: 'Home & Kitchen', icon: '🏠', color: '#FF7C5C', count: 1890 },
  { name: 'Beauty',         icon: '✨', color: '#F472B6', count: 760  },
  { name: 'Technology',     icon: '💻', color: '#60A5FA', count: 430  },
  { name: 'Toys',           icon: '🎮', color: '#FBBF24', count: 350  },
];

const STATS = [
  { value: '12K+', label: 'Products'   },
  { value: '850+', label: 'Vendors'    },
  { value: '99K+', label: 'Customers'  },
  { value: '4.8★', label: 'Avg Rating' },
];

const FEATURES = [
  {
    title: 'AI Personalization',
    desc:  'Hybrid SVD + TF-IDF engine learns your taste and surfaces exactly what you want.',
    accent: 'var(--accent)',
    iconPath: 'M12 2l2 7h7l-6 4 2 7-5-3.5L7 20l2-7L3 9h7z',
  },
  {
    title: 'Verified Reviews',
    desc:  'BERT-powered fake review detection ensures every rating you read is trustworthy.',
    accent: 'var(--success)',
    iconPath: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01 9 11.01',
  },
  {
    title: 'Fast Delivery',
    desc:  'Multi-vendor fulfillment network ensures orders reach you in record time.',
    accent: 'var(--gold)',
    iconPath: 'M5 12h14 M12 5l7 7-7 7',
  },
  {
    title: 'Buyer Protection',
    desc:  'Full escrow and refund policy. Your money is safe until you confirm delivery.',
    accent: '#A78BFA',
    iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setHeroVisible(true)); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate('/products?search=' + encodeURIComponent(searchQ.trim()));
  };

  return (
    <div className="home page-wrapper">

      {/* HERO */}
      <section className={'hero ' + (heroVisible ? 'hero--visible' : '')}>
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1"/>
          <div className="hero__orb hero__orb--2"/>
          <div className="hero__grid"/>
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__eyebrow animate-fade-up">
              <span className="badge badge-accent">✦ AI-Powered Marketplace</span>
            </div>
            <h1 className="hero__title animate-fade-up" style={{animationDelay:'80ms'}}>
              Shop Smarter.<br/>
              <em className="hero__accent">Live Better.</em>
            </h1>
            <p className="hero__subtitle animate-fade-up" style={{animationDelay:'160ms'}}>
              Discover thousands of products from verified vendors, curated by AI
              to match your unique preferences — with every review authenticity-checked.
            </p>

            <form className="hero__search animate-fade-up" style={{animationDelay:'240ms'}} onSubmit={handleSearch}>
              <span className="hero__search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="hero__tags animate-fade-up" style={{animationDelay:'320ms'}}>
              {['Headphones','Running Shoes','Kurta','Smart Watch'].map(t => (
                <button key={t} className="hero__tag" onClick={() => navigate('/products?search='+t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="hero__visual animate-fade-in" style={{animationDelay:'200ms'}}>
            <div className="hero__card-stack">
              <div className="hero__float-card hero__float-card--1">
                <span className="hero__float-spark">✦</span>
                <div><strong>AI Matched</strong><span>Based on your profile</span></div>
              </div>
              <div className="hero__product-preview">
                <div className="hero__product-img"/>
                <div className="hero__product-info">
                  <span className="badge badge-accent" style={{fontSize:10}}>Electronics</span>
                  <p>Wireless Pro Headphones</p>
                  <strong>₹2,499</strong>
                </div>
              </div>
              <div className="hero__float-card hero__float-card--2">
                <span style={{color:'var(--success)',fontSize:18}}>✓</span>
                <div><strong>Review Verified</strong><span>BERT authenticated</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__stats-bar">
          <div className="container">
            <div className="hero__stats">
              {STATS.map(s => (
                <div key={s.label} className="hero__stat">
                  <strong>{s.value}</strong><span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-subtitle">Explore our wide range of product categories</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={'/products?category=' + encodeURIComponent(cat.name)}
                className="cat-card card card-interactive animate-fade-up"
                style={{animationDelay: i*50+'ms', '--cat-color': cat.color}}
              >
                <span className="cat-card__icon">{cat.icon}</span>
                <span className="cat-card__name">{cat.name}</span>
                <span className="cat-card__count">{cat.count.toLocaleString()} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI RECOMMENDATIONS */}
      <section className="section" style={{paddingTop:0}}>
        <div className="container">
          <Recommendations
            userId={user?.id}
            title="Recommended for You"
            subtitle="AI-curated picks based on your browsing and purchase history"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header" style={{textAlign:'center'}}>
            <h2 className="section-title">Why NexusMarket?</h2>
            <p className="section-subtitle">Built different. Built smarter.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feature-card card animate-fade-up"
                style={{animationDelay: i*80+'ms', '--f-accent': f.accent}}>
                <div className="feature-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={f.iconPath}/>
                  </svg>
                </div>
                <h4 className="feature-card__title">{f.title}</h4>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENDOR CTA */}
      <section className="section" style={{paddingTop:0}}>
        <div className="container">
          <div className="vendor-cta">
            <div className="vendor-cta__bg"/>
            <div className="vendor-cta__content">
              <span className="badge badge-gold">For Sellers</span>
              <h2>Start Selling on NexusMarket</h2>
              <p>Join 850+ vendors already growing their business. Easy setup, powerful analytics, zero hidden fees.</p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <Link to="/vendor/register" className="btn btn-primary btn-lg">Become a Vendor</Link>
                <Link to="/vendors" className="btn btn-ghost btn-lg">Browse Vendors</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
