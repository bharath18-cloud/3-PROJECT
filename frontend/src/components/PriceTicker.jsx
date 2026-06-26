import React, { useEffect, useRef } from 'react';

/**
 * PriceTicker - Horizontally scrolling live commodity price banner.
 * Shown at the top of pages to display real-time steel & cement prices.
 * @param {Array} pricesHistory - Array of { category, currentPrice, previousPrice }
 */
export default function PriceTicker({ pricesHistory = [] }) {
  const tickerRef = useRef(null);

  // Auto-scroll animation using CSS (no JS interval needed)
  const items = [...pricesHistory, ...pricesHistory]; // Duplicate for seamless loop

  if (!pricesHistory || pricesHistory.length === 0) return null;

  return (
    <div className="bg-navy-dark border-b border-slate-800 overflow-hidden py-2.5 relative">
      {/* Label badge */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-teal px-4 text-white text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap shadow-glow">
        <i className="fa-solid fa-chart-line mr-2 animate-pulse"></i>
        Live Prices
      </div>

      {/* Scrolling track */}
      <div
        ref={tickerRef}
        className="flex gap-8 pl-32"
        style={{
          animation: 'ticker-scroll 30s linear infinite',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {items.map((p, idx) => {
          const diff = p.currentPrice - p.previousPrice;
          const isUp = diff >= 0;
          const unitLabel = p.category.includes('Cement')
            ? '/Bag'
            : p.category.includes('Wire')
            ? '/Bundle'
            : '/Ton';

          return (
            <span key={idx} className="inline-flex items-center gap-2 text-xs font-semibold text-white">
              <span className="text-slate-400 font-normal">{p.category}</span>
              <span className="font-display font-black text-sm">
                ₹{p.currentPrice.toLocaleString('en-IN')}
                <span className="text-slate-400 font-normal text-[10px]">{unitLabel}</span>
              </span>
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold ${
                  isUp ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <i className={`fa-solid ${isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                {isUp ? '+' : ''}
                {diff.toLocaleString('en-IN')}
              </span>
              <span className="text-slate-700 font-normal text-lg">·</span>
            </span>
          );
        })}
      </div>

      {/* Inline keyframe (injected once) */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
