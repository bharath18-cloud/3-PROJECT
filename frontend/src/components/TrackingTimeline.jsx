import React from 'react';

/**
 * TrackingTimeline - Reusable order shipment milestone visualizer.
 * @param {string} currentStatus - Current delivery stage
 * @param {Array} trackingHistory - Array of { status, time, comment }
 */
export default function TrackingTimeline({ currentStatus, trackingHistory = [] }) {
  const steps = [
    { key: 'Order Confirmed', icon: 'fa-clipboard-check' },
    { key: 'Processing',      icon: 'fa-boxes-stacking' },
    { key: 'Dispatched',      icon: 'fa-truck-moving' },
    { key: 'Out for Delivery',icon: 'fa-location-dot' },
    { key: 'Delivered',       icon: 'fa-circle-check' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="relative pl-8 border-l-2 border-slate-200 ml-5 space-y-8">
      {steps.map((step, idx) => {
        const isDone    = idx <= currentStepIdx;
        const isCurrent = idx === currentStepIdx;
        const milestone = trackingHistory.find((h) => h.status === step.key);

        return (
          <div key={step.key} className="relative">
            {/* Circle bullet */}
            <div
              className={`absolute -left-[46px] top-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-500 ${
                isCurrent
                  ? 'bg-teal border-teal text-white shadow-glow pulse-glow'
                  : isDone
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-slate-300 text-slate-300'
              }`}
            >
              <i className={`fa-solid ${isDone ? step.icon : 'fa-circle'} text-xs`}></i>
            </div>

            {/* Milestone content */}
            <div className="pb-2">
              <h4
                className={`text-sm font-bold transition-colors ${
                  isCurrent ? 'text-teal' : isDone ? 'text-navy' : 'text-slate-300'
                }`}
              >
                {step.key}
              </h4>

              {milestone ? (
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-slate-500 leading-relaxed">{milestone.comment}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">{milestone.time}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-300 mt-0.5 italic">Awaiting this stage...</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
