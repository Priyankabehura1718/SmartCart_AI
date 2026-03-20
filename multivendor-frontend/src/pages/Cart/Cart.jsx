// src/pages/Cart/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, totalPrice, totalItems, dispatch } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </div>
    </div>
  );

  const shipping = totalPrice >= 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18);
  const total = totalPrice + shipping + tax;

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span>({totalItems} items)</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item card animate-fade-up">
                <div className="cart-item-img">
                  <img src={item.image || 'https://picsum.photos/seed/cart-'+item.id+'/120/120'}
                    alt={item.name} onError={e=>{e.target.src='https://picsum.photos/seed/cart-'+item.id+'/120/120';}}/>
                </div>
                <div className="cart-item-info">
                  <Link to={'/products/'+item.id} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-item-actions">
                  <div className="pd-qty">
                    <button className="btn btn-ghost btn-icon-sm"
                      onClick={()=>dispatch({type:'UPDATE_QTY',payload:{id:item.id,qty:item.qty-1}})}>−</button>
                    <span className="pd-qty-val">{item.qty}</span>
                    <button className="btn btn-ghost btn-icon-sm"
                      onClick={()=>dispatch({type:'UPDATE_QTY',payload:{id:item.id,qty:item.qty+1}})}>+</button>
                  </div>
                  <span className="cart-item-subtotal">₹{(item.price*item.qty).toLocaleString('en-IN')}</span>
                  <button className="btn btn-danger btn-icon-sm"
                    onClick={()=>dispatch({type:'REMOVE_ITEM',payload:item.id})} title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button className="btn btn-ghost btn-sm cart-clear"
              onClick={()=>dispatch({type:'CLEAR'})}>
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <strong className={shipping===0?'free':''}>
                  {shipping===0 ? 'FREE' : '₹'+shipping}
                </strong>
              </div>
              <div className="cart-summary-row">
                <span>GST (18%)</span>
                <strong>₹{tax.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {shipping > 0 && (
              <div className="cart-free-shipping">
                Add ₹{(999-totalPrice).toLocaleString('en-IN')} more for FREE shipping
              </div>
            )}

            <div className="cart-summary-divider"/>
            <div className="cart-summary-total">
              <span>Total</span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>

            <button className="btn btn-primary btn-lg cart-checkout-btn"
              onClick={()=>navigate('/checkout')}>
              Proceed to Checkout
            </button>

            <div className="cart-trust">
              <span>🔒 Secured by SSL encryption</span>
              <span>↩ Free returns within 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
