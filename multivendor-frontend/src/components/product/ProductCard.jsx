// src/components/product/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

// Deterministic placeholder image using product id
const placeholder = (id) =>
  `https://picsum.photos/seed/product-${id || 1}/400/300`;

function StarRating({ rating, count }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="pcard__stars">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= rounded ? 'var(--gold)' : 'none'}
          stroke={s <= rounded ? 'var(--gold)' : 'var(--text-muted)'}
          strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      {count != null && <span className="pcard__review-count">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product, showAiBadge = false }) {
  const { dispatch } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const {
    id, name, price, original_price, image, category,
    rating, review_count, vendor_name, is_in_stock = true,
    ai_score, is_fake_flagged
  } = product;

  const discount = original_price
    ? Math.round((1 - price / original_price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_ITEM', payload: { id, name, price, image } });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setWishlisted(v => !v);
  };

  return (
    <Link to={`/products/${id}`} className="pcard card card-interactive">
      {/* Image */}
      <div className="pcard__img-wrap">
        <img
          src={image || placeholder(id)}
          alt={name}
          className="pcard__img"
          loading="lazy"
          onError={e => { e.target.src = placeholder(id); }}
        />

        {/* Badges */}
        <div className="pcard__badges">
          {discount > 0 && <span className="pcard__badge pcard__badge--discount">-{discount}%</span>}
          {!is_in_stock && <span className="pcard__badge pcard__badge--oos">Out of Stock</span>}
          {showAiBadge && ai_score > 0.8 && (
            <span className="pcard__badge pcard__badge--ai">✦ AI Pick</span>
          )}
        </div>

        {/* Wishlist */}
        <button className={`pcard__wishlist ${wishlisted ? 'active' : ''}`} onClick={handleWishlist} title="Add to wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={wishlisted ? 'var(--danger)' : 'none'}
            stroke={wishlisted ? 'var(--danger)' : 'currentColor'}
            strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick add */}
        <button
          className={`pcard__quick-add btn btn-primary btn-sm ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={!is_in_stock || addedToCart}
        >
          {addedToCart ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>

      {/* Body */}
      <div className="pcard__body">
        {category && <span className="pcard__category">{category}</span>}
        <h3 className="pcard__name">{name}</h3>

        {vendor_name && (
          <div className="pcard__vendor">by <span>{vendor_name}</span></div>
        )}

        {rating != null && <StarRating rating={rating} count={review_count} />}

        {/* Fake review warning */}
        {is_fake_flagged && (
          <div className="pcard__fake-warning">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            Review quality flagged by AI
          </div>
        )}

        {/* Price */}
        <div className="pcard__price-row">
          <span className="price price-accent">₹{price?.toLocaleString('en-IN')}</span>
          {original_price && (
            <span className="price price-original">₹{original_price?.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
