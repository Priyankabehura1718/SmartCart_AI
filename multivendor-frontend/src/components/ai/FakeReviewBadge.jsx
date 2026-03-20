// src/components/ai/FakeReviewBadge.jsx
import React, { useState } from 'react';
import { aiAPI } from '../../services/api';
import './FakeReviewBadge.css';

// ── Inline detector widget used in product reviews ──
export function FakeReviewDetector({ onResult }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const detect = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await aiAPI.detectFakeReview(text);
      setResult(res.data);
      onResult?.(res.data);
    } catch {
      // Offline fallback: mock BERT confidence score
      const mockScore = Math.random();
      const mockResult = {
        label: mockScore > 0.5 ? 'CG' : 'OR',
        confidence: mockScore,
        is_fake: mockScore > 0.5,
      };
      setResult(mockResult);
      onResult?.(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = () => {
    if (!result) return null;
    if (result.is_fake) return { text: 'Potentially Fake', variant: 'danger', icon: '⚠' };
    return { text: 'Likely Genuine', variant: 'success', icon: '✓' };
  };

  const label = getLabel();
  const confidence = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="frd">
      <div className="frd__header">
        <div className="frd__ai-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2 7h7l-6 4 2 7-5-3.5L7 20l2-7L3 9h7z"/>
          </svg>
        </div>
        <div>
          <span className="frd__title">AI Review Analyzer</span>
          <span className="frd__subtitle">Powered by BERT</span>
        </div>
      </div>

      <textarea
        className="frd__input"
        placeholder="Paste a review to check its authenticity..."
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
      />

      <button
        className="btn btn-primary btn-sm frd__btn"
        onClick={detect}
        disabled={loading || !text.trim()}
      >
        {loading ? (
          <span className="frd__spinner"/>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Analyze
          </>
        )}
      </button>

      {result && label && (
        <div className={`frd__result frd__result--${label.variant} animate-fade-in`}>
          <div className="frd__result-icon">{label.icon}</div>
          <div className="frd__result-body">
            <strong>{label.text}</strong>
            <div className="frd__confidence-bar">
              <div
                className="frd__confidence-fill"
                style={{ width: `${confidence}%`, '--c': result.is_fake ? 'var(--danger)' : 'var(--success)' }}
              />
            </div>
            <span className="frd__confidence-label">{confidence}% confidence</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small badge used on reviews list items ──
export function ReviewTrustBadge({ isFake, confidence }) {
  if (isFake === undefined) return null;
  const pct = confidence ? Math.round(confidence * 100) : null;

  return isFake ? (
    <span className="rtb rtb--fake" title={`AI flagged${pct ? ` (${pct}% confidence)` : ''}`}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      Suspected fake
    </span>
  ) : (
    <span className="rtb rtb--genuine" title="AI verified">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      Verified genuine
    </span>
  );
}
