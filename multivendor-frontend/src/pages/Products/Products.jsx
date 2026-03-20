// src/pages/Products/Products.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import ProductCard from '../../components/product/ProductCard';
import './Products.css';

const CATEGORIES = ['All','Electronics','Apparel','Books','Sports','Home & Kitchen','Beauty','Technology','Toys'];
const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'popular',   label: 'Most Popular' },
];

// Mock products when API is offline
const MOCK_PRODUCTS = Array.from({length: 16}, (_,i) => ({
  id: i+1, name: ['Wireless Headphones','Running Shoes','Cotton Kurta','Smart Watch','Yoga Mat','Backpack','Sunglasses','Bluetooth Speaker','Gaming Mouse','Novel: The Alchemist','Air Purifier','Coffee Maker','Cricket Bat','Moisturizer','USB Hub','Desk Lamp'][i],
  price: [2499,1299,799,5999,899,1599,1199,1899,1499,299,4999,2999,1799,599,899,749][i],
  original_price: [3999,1899,null,8999,1299,null,1799,2499,null,399,6999,3999,null,null,1199,999][i],
  category: CATEGORIES[1+(i%8)],
  rating: 3.5 + Math.random()*1.5,
  review_count: Math.floor(20+Math.random()*200),
  vendor_name: ['TechZone','SportsPro','FashionHub','GadgetWorld','LifeStyle'][i%5],
  is_in_stock: i !== 7 && i !== 13,
}));

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage]           = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchQ   = searchParams.get('search')   || '';
  const category  = searchParams.get('category') || 'All';
  const sortBy    = searchParams.get('sort')      || 'newest';
  const minPrice  = searchParams.get('minPrice')  || '';
  const maxPrice  = searchParams.get('maxPrice')  || '';

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k,v]) => { if(v) next.set(k,v); else next.delete(k); });
    next.delete('page');
    setSearchParams(next);
    setPage(1);
  };

  const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
    const params = { page, ordering: sortBy };

    if (searchQ) params.search = searchQ;
    if (category !== 'All') params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;

    // ✅ FIXED HERE
    const res = await api.get('/products/', { params });

    setProducts(res.data?.results || res.data || []);
    setTotalCount(res.data?.count || 0);

  } catch (err) {
    console.log('API failed, using mock data');

    let filtered = MOCK_PRODUCTS;

    if (searchQ)
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQ.toLowerCase())
      );

    if (category !== 'All')
      filtered = filtered.filter(p => p.category === category);

    setProducts(filtered);
    setTotalCount(filtered.length);

  } finally {
    setLoading(false);
  }
}, [page, sortBy, searchQ, category, minPrice, maxPrice]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="products-page page-wrapper">
      <div className="container">

        {/* Header */}
        <div className="products-header">
          <div>
            <h1 className="products-title">
              {searchQ ? `Results for "${searchQ}"` : category !== 'All' ? category : 'All Products'}
            </h1>
            {!loading && <p className="products-count">{totalCount.toLocaleString()} products found</p>}
          </div>
          <div className="products-header-actions">
            <select className="products-sort input" value={sortBy} onChange={e => updateParams({sort: e.target.value})}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(v=>!v)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
              </svg>
              Filters
            </button>
          </div>
        </div>

        <div className="products-layout">

          {/* Sidebar */}
          <aside className={'products-sidebar ' + (sidebarOpen ? 'open' : '')}>
            <div className="sidebar-section">
              <h4 className="sidebar-title">Category</h4>
              <div className="sidebar-cats">
                {CATEGORIES.map(c => (
                  <button key={c}
                    className={'sidebar-cat ' + (category === c ? 'active' : '')}
                    onClick={() => updateParams({category: c === 'All' ? '' : c})}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="sidebar-title">Price Range</h4>
              <div className="sidebar-price">
                <input className="input" type="number" placeholder="Min ₹" value={minPrice}
                  onChange={e => updateParams({minPrice: e.target.value})}/>
                <span style={{color:'var(--text-muted)'}}>–</span>
                <input className="input" type="number" placeholder="Max ₹" value={maxPrice}
                  onChange={e => updateParams({maxPrice: e.target.value})}/>
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="sidebar-title">Rating</h4>
              {[4,3,2,1].map(r => (
                <button key={r} className="sidebar-rating-btn">
                  {'★'.repeat(r)}{'☆'.repeat(5-r)} <span>& up</span>
                </button>
              ))}
            </div>

            <button className="btn btn-ghost btn-sm sidebar-reset"
              onClick={() => setSearchParams({})}>
              Clear All Filters
            </button>
          </aside>

          {/* Grid */}
          <main className="products-main">
            {loading ? (
              <div className="grid-4">
                {[...Array(8)].map((_,i) => (
                  <div key={i} className="pcard-skeleton">
                    <div className="skeleton" style={{height:200}}/>
                    <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}>
                      <div className="skeleton" style={{height:11,width:'50%'}}/>
                      <div className="skeleton" style={{height:14,width:'88%'}}/>
                      <div className="skeleton" style={{height:14,width:'70%'}}/>
                      <div className="skeleton" style={{height:18,width:'38%',marginTop:6}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="products-empty">
                <span style={{fontSize:48}}>🔍</span>
                <h3>No products found</h3>
                <p>Try a different search or remove some filters.</p>
                <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
              </div>
            ) : (
              <div className="grid-4">
                {products.map((p,i) => (
                  <div key={p.id} className="animate-fade-up" style={{animationDelay: Math.min(i,8)*40+'ms'}}>
                    <ProductCard product={p}/>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalCount > 16 && (
              <div className="pagination">
                <button className="btn btn-ghost btn-sm" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</button>
                <span className="pagination-info">Page {page} of {Math.ceil(totalCount/16)}</span>
                <button className="btn btn-ghost btn-sm" disabled={page>=Math.ceil(totalCount/16)} onClick={() => setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
