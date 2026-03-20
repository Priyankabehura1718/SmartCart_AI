// src/components/ai/Recommendations.jsx
import React, { useEffect, useState } from 'react';
import { aiAPI } from '../../services/api';
import ProductCard from '../product/ProductCard';
import './Recommendations.css';

// Mock data for demo when API is offline
const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 2499, original_price: 3999, category: 'Electronics', rating: 4.5, review_count: 128, vendor_name: 'TechZone', ai_score: 0.95 },
  { id: 2, name: 'Running Shoes - Lightweight Mesh', price: 1299, original_price: 1899, category: 'Sports', rating: 4.2, review_count: 84, vendor_name: 'SportsPro', ai_score: 0.88 },
  { id: 3, name: 'Organic Cotton Kurta', price: 799, category: 'Apparel', rating: 4.7, review_count: 213, vendor_name: 'FashionHub', ai_score: 0.91 },
  { id: 4, name: 'Stainless Steel Water Bottle', price: 449, original_price: 599, category: 'Home & Kitchen', rating: 4.4, review_count: 56, vendor_name: 'HomeEssentials', ai_score: 0.82 },
];

export default function Recommendations({ userId, title = 'Recommended for You', subtitle = 'Personalized picks by our AI engine' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { key: 'personal', label: 'For You' },
    { key: 'trending', label: 'Trending' },
    { key: 'similar', label: 'Similar' },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = userId
          ? await aiAPI.recommendations(userId)
          : await aiAPI.trending();
        setProducts(res.data?.results || res.data || []);
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, activeTab]);

  return (
    <section className="ai-recs">
      {/* Header */}
      <div className="ai-recs__header">
        <div>
          <div className="ai-recs__label">
            <span className="ai-recs__spark">✦</span>
            AI-Powered
          </div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <div className="ai-recs__tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`ai-recs__tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="ai-recs__skeleton">
              <div className="skeleton" style={{ height: 200 }}/>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ height: 12, width: '60%' }}/>
                <div className="skeleton" style={{ height: 14, width: '90%' }}/>
                <div className="skeleton" style={{ height: 14, width: '75%' }}/>
                <div className="skeleton" style={{ height: 18, width: '40%', marginTop: 4 }}/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-4">
          {products.slice(0, 8).map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <ProductCard product={p} showAiBadge />
            </div>
          ))}
        </div>
      )}

      {/* AI insight strip */}
      <div className="ai-recs__insight">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Recommendations generated using hybrid SVD + TF-IDF collaborative filtering based on your browsing & purchase history.
      </div>
    </section>
  );
}
