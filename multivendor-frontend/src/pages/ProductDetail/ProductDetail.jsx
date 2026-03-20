// src/pages/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { FakeReviewDetector, ReviewTrustBadge } from '../../components/ai/FakeReviewBadge';
import Recommendations from '../../components/ai/Recommendations';
import './ProductDetail.css';

const MOCK = {
  id:1, name:'Wireless Pro Headphones X1',
  price:2499, original_price:3999, category:'Electronics',
  rating:4.4, review_count:128, vendor_name:'TechZone', vendor_id:1,
  is_in_stock:true,
  description:'Premium noise-cancelling headphones with 40hr battery life, aptX HD codec, and a foldable design. Ideal for travel, work-from-home, and immersive listening sessions.',
  specs:[
    {label:'Driver Size',value:'40mm Dynamic'},
    {label:'Frequency',value:'20Hz – 20kHz'},
    {label:'Battery',value:'40 hours ANC on'},
    {label:'Connectivity',value:'Bluetooth 5.2 / 3.5mm'},
    {label:'Weight',value:'250g'},
    {label:'Color',value:'Midnight Black'},
  ],
  images:[null,null,null],
};
const MOCK_REVIEWS = [
  {id:1,user:'Arjun M.',rating:5,text:'Absolutely love these headphones! The sound quality is crystal clear and the ANC is impressive. Battery lasts all day.',date:'2024-01-15',is_fake:false,confidence:0.92},
  {id:2,user:'Priya S.',rating:4,text:'Great value for money. Very comfortable to wear for long periods. Only wish the mic was better for calls.',date:'2024-01-10',is_fake:false,confidence:0.88},
  {id:3,user:'User_xyz',rating:5,text:'Best product ever!!!! Amazing amazing amazing buy now buy now buy now 5 stars!!!',date:'2024-01-08',is_fake:true,confidence:0.79},
  {id:4,user:'Rahul K.',rating:3,text:'Sound is decent but the headband started creaking after 2 months. Customer support was helpful though.',date:'2024-01-05',is_fake:false,confidence:0.85},
];

function Stars({rating, size=16}) {
  return (
    <div style={{display:'flex',gap:2}}>
      {[1,2,3,4,5].map(s=>(
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s<=Math.round(rating)?'var(--gold)':'none'}
          stroke={s<=Math.round(rating)?'var(--gold)':'var(--text-muted)'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('reviews');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, rRes] = await Promise.all([productsAPI.detail(id), reviewsAPI.forProduct(id)]);
        setProduct(pRes.data);
        setReviews(rRes.data?.results || rRes.data || []);
      } catch {
        setProduct(MOCK);
        setReviews(MOCK_REVIEWS);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const addToCart = () => {
    dispatch({ type:'ADD_ITEM', payload:{id:product.id, name:product.name, price:product.price, image:product.image} });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="pd-page page-wrapper">
      <div className="container">
        <div className="pd-skeleton">
          <div className="skeleton" style={{height:500,borderRadius:'var(--radius-lg)'}}/>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[80,40,60,120,200].map((h,i)=><div key={i} className="skeleton" style={{height:h,borderRadius:'var(--radius-md)'}}/>)}
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const discount = product.original_price ? Math.round((1-product.price/product.original_price)*100) : 0;
  const placeholder = `https://picsum.photos/seed/prod-${id}/600/500`;

  return (
    <div className="pd-page page-wrapper">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/products">Products</Link><span>/</span>
          {product.category && <><Link to={'/products?category='+product.category}>{product.category}</Link><span>/</span></>}
          <span>{product.name}</span>
        </nav>

        {/* Main layout */}
        <div className="pd-main">

          {/* Images */}
          <div className="pd-images">
            <div className="pd-img-main">
              <img src={product.image || placeholder} alt={product.name}
                onError={e=>{e.target.src=placeholder;}}/>
              {discount>0 && <span className="pd-discount-badge">-{discount}%</span>}
            </div>
            <div className="pd-img-thumbs">
              {[product.image,...(product.images||[null,null])].slice(0,4).map((img,i)=>(
                <button key={i} className={'pd-thumb '+(activeImg===i?'active':'')} onClick={()=>setActiveImg(i)}>
                  <img src={img||`https://picsum.photos/seed/prod-${id}-${i}/120/100`} alt={'View '+i}
                    onError={e=>{e.target.src=`https://picsum.photos/seed/prod-${id}-${i}/120/100`;}}/>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-info-header">
              {product.category && <span className="badge badge-accent">{product.category}</span>}
              <h1 className="pd-title">{product.name}</h1>

              <div className="pd-meta">
                <Stars rating={product.rating}/>
                <span className="pd-rating-val">{product.rating?.toFixed(1)}</span>
                <span className="pd-review-count">({product.review_count} reviews)</span>
              </div>

              {product.vendor_name && (
                <div className="pd-vendor">
                  Sold by <Link to={'/vendors/'+product.vendor_id} className="pd-vendor-link">{product.vendor_name}</Link>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <span className="price price-accent pd-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.original_price && (
                <span className="price price-original">₹{product.original_price?.toLocaleString('en-IN')}</span>
              )}
              {discount>0 && <span className="badge badge-success">{discount}% off</span>}
            </div>

            {/* Stock */}
            <div className={'pd-stock '+(product.is_in_stock?'in-stock':'out-of-stock')}>
              <span className="pd-stock-dot"/>
              {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Description */}
            <p className="pd-desc">{product.description}</p>

            {/* Qty + CTA */}
            <div className="pd-actions">
              <div className="pd-qty">
                <button className="btn btn-ghost btn-icon-sm" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                <span className="pd-qty-val">{qty}</span>
                <button className="btn btn-ghost btn-icon-sm" onClick={()=>setQty(q=>q+1)}>+</button>
              </div>
              <button className={'btn btn-primary pd-add-btn '+(added?'added':'')}
                onClick={addToCart} disabled={!product.is_in_stock||added}>
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button className="btn btn-ghost btn-icon" title="Add to wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Specs */}
            {product.specs && (
              <div className="pd-specs">
                <h4 className="pd-specs-title">Specifications</h4>
                <div className="pd-specs-grid">
                  {product.specs.map(s=>(
                    <div key={s.label} className="pd-spec-row">
                      <span className="pd-spec-label">{s.label}</span>
                      <span className="pd-spec-val">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Reviews / AI Detector */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            {[['reviews','Reviews ('+reviews.length+')'],['ai','AI Review Analyzer'],['about','About Vendor']].map(([k,l])=>(
              <button key={k} className={'pd-tab '+(tab===k?'active':'')} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>

          {tab==='reviews' && (
            <div className="pd-reviews animate-fade-in">
              {/* Summary */}
              <div className="pd-review-summary">
                <div className="pd-review-big">
                  <strong>{product.rating?.toFixed(1)}</strong>
                  <Stars rating={product.rating} size={20}/>
                  <span>{product.review_count} reviews</span>
                </div>
                <div className="pd-fake-stat">
                  <span className="badge badge-warning">
                    {reviews.filter(r=>r.is_fake).length} suspected fake reviews detected
                  </span>
                  <span style={{fontSize:12,color:'var(--text-muted)',display:'block',marginTop:4}}>
                    Analyzed by our BERT AI model
                  </span>
                </div>
              </div>

              {/* Review list */}
              <div className="pd-review-list">
                {reviews.map(r=>(
                  <div key={r.id} className={'pd-review '+(r.is_fake?'pd-review--flagged':'')}>
                    <div className="pd-review-header">
                      <div className="pd-review-avatar">{r.user?.[0]?.toUpperCase()||'U'}</div>
                      <div className="pd-review-meta">
                        <strong>{r.user}</strong>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <Stars rating={r.rating} size={13}/>
                          <span style={{fontSize:12,color:'var(--text-muted)'}}>{r.date}</span>
                        </div>
                      </div>
                      <ReviewTrustBadge isFake={r.is_fake} confidence={r.confidence}/>
                    </div>
                    <p className="pd-review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='ai' && (
            <div className="pd-ai-tab animate-fade-in">
              <div className="pd-ai-header">
                <h3>Fake Review Detector</h3>
                <p>Paste any review text below and our BERT model will analyze its authenticity.</p>
              </div>
              <FakeReviewDetector/>
            </div>
          )}

          {tab==='about' && (
            <div className="pd-vendor-tab animate-fade-in">
              <div className="pd-vendor-card card">
                <div className="pd-vendor-header">
                  <div className="pd-vendor-avatar">{product.vendor_name?.[0]}</div>
                  <div>
                    <h3>{product.vendor_name}</h3>
                    <span className="badge badge-success">Verified Vendor</span>
                  </div>
                </div>
                <div className="pd-vendor-stats">
                  <div><strong>4.6★</strong><span>Avg Rating</span></div>
                  <div><strong>1.2K+</strong><span>Products</span></div>
                  <div><strong>98%</strong><span>On-time Delivery</span></div>
                  <div><strong>3yrs</strong><span>On NexusMarket</span></div>
                </div>
                <Link to={'/vendors/'+product.vendor_id} className="btn btn-ghost btn-sm" style={{alignSelf:'flex-start'}}>
                  View Store →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Related recommendations */}
        <div className="section" style={{paddingBottom:0}}>
          <Recommendations title="You May Also Like" subtitle="Products similar to what you're viewing"/>
        </div>

      </div>
    </div>
  );
}
