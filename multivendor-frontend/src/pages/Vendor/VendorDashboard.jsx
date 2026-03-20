// src/pages/Vendor/VendorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorsAPI, productsAPI } from '../../services/api';
import './VendorDashboard.css';

const MOCK_STATS = { total_products:47, total_orders:312, revenue:182450, avg_rating:4.6, pending_orders:8, reviews_flagged:3 };
const MOCK_ORDERS = [
  {id:'#2401',product:'Wireless Headphones',customer:'Arjun M.',amount:2499,status:'shipped',date:'2024-01-15'},
  {id:'#2400',product:'Running Shoes',customer:'Priya S.',amount:1299,status:'delivered',date:'2024-01-14'},
  {id:'#2399',product:'Smart Watch',customer:'Rahul K.',amount:5999,status:'pending',date:'2024-01-14'},
  {id:'#2398',product:'Cotton Kurta',customer:'Meera P.',amount:799,status:'processing',date:'2024-01-13'},
  {id:'#2397',product:'Yoga Mat',customer:'Vikram T.',amount:899,status:'delivered',date:'2024-01-12'},
];
const MOCK_PRODUCTS = [
  {id:1,name:'Wireless Headphones X1',price:2499,stock:23,sales:128,rating:4.5},
  {id:2,name:'Bluetooth Speaker Pro',price:1899,stock:0,sales:64,rating:4.2},
  {id:3,name:'USB Type-C Hub',price:899,stock:48,sales:210,rating:4.7},
  {id:4,name:'Laptop Stand Adjustable',price:1299,stock:15,sales:89,rating:4.3},
];

const STATUS_COLORS = { pending:'warning', processing:'accent', shipped:'gold', delivered:'success', cancelled:'danger' };

function StatCard({ value, label, icon, delta }) {
  return (
    <div className="vd-stat card">
      <div className="vd-stat-icon">{icon}</div>
      <div className="vd-stat-body">
        <span className="vd-stat-label">{label}</span>
        <strong className="vd-stat-value">{value}</strong>
        {delta && <span className={'vd-stat-delta '+delta.dir}>{delta.dir==='up'?'↑':'↓'} {delta.pct}% this month</span>}
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, oRes, pRes] = await Promise.all([vendorsAPI.stats(), vendorsAPI.dashboard(), productsAPI.byVendor('me')]);
        setStats(sRes.data);
        setOrders(oRes.data?.recent_orders || MOCK_ORDERS);
        setProducts(pRes.data?.results || MOCK_PRODUCTS);
      } catch { /* use mock */ }
    };
    load();
  }, []);

  return (
    <div className="vd-page page-wrapper">
      <div className="container">

        {/* Header */}
        <div className="vd-header">
          <div>
            <h1 className="vd-title">Vendor Dashboard</h1>
            <p style={{color:'var(--text-muted)',fontSize:14}}>Welcome back! Here's what's happening with your store.</p>
          </div>
          <div style={{display:'flex',gap:10}}>
            <Link to="/vendor/products/new" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="vd-tabs">
          {[['overview','Overview'],['products','Products'],['orders','Orders'],['ai','AI Insights']].map(([k,l])=>(
            <button key={k} className={'vd-tab '+(activeTab===k?'active':'')} onClick={()=>setActiveTab(k)}>{l}</button>
          ))}
        </div>

        {activeTab==='overview' && (
          <div className="animate-fade-in">
            {/* Stats grid */}
            <div className="vd-stats-grid">
              <StatCard value={'₹'+stats.revenue?.toLocaleString('en-IN')} label="Total Revenue"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                delta={{dir:'up',pct:12}}/>
              <StatCard value={stats.total_orders} label="Total Orders"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>}
                delta={{dir:'up',pct:8}}/>
              <StatCard value={stats.total_products} label="Active Products"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>}/>
              <StatCard value={stats.avg_rating+'★'} label="Avg Rating"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                delta={{dir:'up',pct:2}}/>
            </div>

            {/* Alert cards */}
            <div className="vd-alerts">
              {stats.pending_orders > 0 && (
                <div className="vd-alert vd-alert--warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span><strong>{stats.pending_orders} orders</strong> are waiting to be processed.</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setActiveTab('orders')}>View Orders</button>
                </div>
              )}
              {stats.reviews_flagged > 0 && (
                <div className="vd-alert vd-alert--accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-6 4 2 7-5-3.5L7 20l2-7L3 9h7z"/></svg>
                  <span>AI detected <strong>{stats.reviews_flagged} potentially fake reviews</strong> on your products.</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setActiveTab('ai')}>Review</button>
                </div>
              )}
            </div>

            {/* Recent orders preview */}
            <div className="vd-section">
              <div className="vd-section-header">
                <h3>Recent Orders</h3>
                <button className="btn btn-ghost btn-sm" onClick={()=>setActiveTab('orders')}>View All</button>
              </div>
              <div className="vd-table-wrap card">
                <table className="vd-table">
                  <thead><tr><th>Order</th><th>Product</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.slice(0,5).map(o=>(
                      <tr key={o.id}>
                        <td className="vd-order-id">{o.id}</td>
                        <td>{o.product}</td>
                        <td style={{color:'var(--text-secondary)'}}>{o.customer}</td>
                        <td className="vd-amount">₹{o.amount?.toLocaleString('en-IN')}</td>
                        <td><span className={'badge badge-'+STATUS_COLORS[o.status]}>{o.status}</span></td>
                        <td style={{color:'var(--text-muted)',fontSize:13}}>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab==='products' && (
          <div className="animate-fade-in">
            <div className="vd-section">
              <div className="vd-section-header">
                <h3>Your Products ({products.length})</h3>
                <Link to="/vendor/products/new" className="btn btn-primary btn-sm">+ Add New</Link>
              </div>
              <div className="vd-products-grid">
                {products.map(p=>(
                  <div key={p.id} className="vd-product-card card">
                    <div className="vd-product-img">
                      <img src={'https://picsum.photos/seed/vp-'+p.id+'/200/160'} alt={p.name}/>
                    </div>
                    <div className="vd-product-body">
                      <h4 className="vd-product-name">{p.name}</h4>
                      <div className="vd-product-meta">
                        <span className="price price-accent" style={{fontSize:15}}>₹{p.price?.toLocaleString('en-IN')}</span>
                        <span className={'badge '+(p.stock>0?'badge-success':'badge-danger')}>{p.stock>0?p.stock+' in stock':'Out of stock'}</span>
                      </div>
                      <div style={{display:'flex',gap:8,marginTop:12}}>
                        <Link to={'/vendor/products/'+p.id+'/edit'} className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center'}}>Edit</Link>
                        <button className="btn btn-danger btn-sm btn-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab==='orders' && (
          <div className="animate-fade-in vd-section">
            <div className="vd-table-wrap card">
              <table className="vd-table">
                <thead><tr><th>Order ID</th><th>Product</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o.id}>
                      <td className="vd-order-id">{o.id}</td>
                      <td>{o.product}</td>
                      <td style={{color:'var(--text-secondary)'}}>{o.customer}</td>
                      <td className="vd-amount">₹{o.amount?.toLocaleString('en-IN')}</td>
                      <td><span className={'badge badge-'+STATUS_COLORS[o.status]}>{o.status}</span></td>
                      <td style={{color:'var(--text-muted)',fontSize:13}}>{o.date}</td>
                      <td><button className="btn btn-ghost btn-sm">Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==='ai' && (
          <div className="animate-fade-in">
            <div className="vd-ai-panel">
              <div className="vd-ai-header">
                <div className="vd-ai-icon">✦</div>
                <div>
                  <h3>AI Insights for Your Store</h3>
                  <p>Powered by your BERT fake review detector and SVD recommendation engine</p>
                </div>
              </div>
              <div className="vd-ai-cards">
                <div className="card vd-ai-card">
                  <h4>Review Authenticity Report</h4>
                  <div className="vd-ai-bar-group">
                    <div className="vd-ai-bar-row">
                      <span>Genuine</span>
                      <div className="vd-bar"><div className="vd-bar-fill" style={{width:'94%',background:'var(--success)'}}/></div>
                      <strong>94%</strong>
                    </div>
                    <div className="vd-ai-bar-row">
                      <span>Suspected fake</span>
                      <div className="vd-bar"><div className="vd-bar-fill" style={{width:'6%',background:'var(--warning)'}}/></div>
                      <strong>6%</strong>
                    </div>
                  </div>
                  <p style={{fontSize:13,color:'var(--text-muted)',marginTop:12}}>3 reviews flagged. Consider requesting re-verification from flagged users.</p>
                </div>
                <div className="card vd-ai-card">
                  <h4>Recommendation Performance</h4>
                  <div className="vd-ai-bar-group">
                    <div className="vd-ai-bar-row"><span>Click-through rate</span><div className="vd-bar"><div className="vd-bar-fill" style={{width:'68%',background:'var(--accent)'}}/></div><strong>68%</strong></div>
                    <div className="vd-ai-bar-row"><span>Conversion from recs</span><div className="vd-bar"><div className="vd-bar-fill" style={{width:'34%',background:'var(--accent)'}}/></div><strong>34%</strong></div>
                  </div>
                  <p style={{fontSize:13,color:'var(--text-muted)',marginTop:12}}>Your products appear in 2,300+ AI-generated recommendation feeds.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
