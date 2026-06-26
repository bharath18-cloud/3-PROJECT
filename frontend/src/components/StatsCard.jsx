import React from 'react';

/**
 * StatsCard - Reusable analytics widget for the Admin Dashboard.
 * @param {string} label - Metric title
 * @param {string|number} value - Primary displayed value
 * @param {string} icon - FontAwesome icon class (e.g. "fa-chart-line")
 * @param {string} trend - Optional trend text (e.g. "+12%")
 * @param {'up'|'down'|'neutral'} trendDirection - Controls trend color
 * @param {string} subLabel - Secondary caption text
 */
export default function StatsCard({ label, value, icon, trend, trendDirection = 'up', subLabel }) {
  const trendColor =
    trendDirection === 'up'
      ? 'text-green-600'
      : trendDirection === 'down'
      ? 'text-red-500'
      : 'text-slate-400';

  const trendIcon =
    trendDirection === 'up'
      ? 'fa-caret-up'
      : trendDirection === 'down'
      ? 'fa-caret-down'
      : 'fa-minus';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center text-teal text-lg">
          <i className={`fa-solid ${icon}`}></i>
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center gap-1 ${trendColor}`}>
            <i className={`fa-solid ${trendIcon}`}></i>
            {trend}
          </span>
        )}
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
        {label}
      </span>
      <span className="font-display font-black text-2xl text-navy block mt-1">{value}</span>
      {subLabel && (
        <span className="text-xs text-slate-400 block mt-1">{subLabel}</span>
      )}
    </div>
  );
}
