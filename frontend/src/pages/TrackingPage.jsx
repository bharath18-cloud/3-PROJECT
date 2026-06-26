import React, { useState, useEffect } from 'react';
import TrackingTimeline from '../components/TrackingTimeline';

export default function TrackingPage({ orders, trackingOrderId, setTrackingOrderId }) {
  const [searchQuery, setSearchQuery] = useState(trackingOrderId || '');
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (trackingOrderId && orders) {
      const ord = orders.find((o) => o.id === trackingOrderId);
      setMatchedOrder(ord || null);
      setSearched(true);
    }
  }, [trackingOrderId, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    if (!orders) return;
    const ord = orders.find((o) => o.id.toUpperCase() === searchQuery.trim().toUpperCase());
    setMatchedOrder(ord || null);
    if (ord && setTrackingOrderId) {
      setTrackingOrderId(ord.id);
    }
  };

  const steps = ['Order Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = matchedOrder ? steps.indexOf(matchedOrder.deliveryStatus) : -1;

  return (
    <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-extrabold text-navy">Logistics Delivery Tracking</h1>
        <p className="text-slate-500 text-sm mt-1">Track material dispatches from the warehouse to your site layout.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 mb-8 flex gap-3">
        <input 
          type="text" 
          placeholder="Enter B2B Order ID (e.g. ORD-98721)"
          required
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-mono font-semibold"
        />
        <button 
          type="submit"
          className="bg-teal hover:bg-teal-dark text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-glow text-xs uppercase tracking-wider flex items-center gap-1.5"
        >
          <i className="fa-solid fa-location-crosshairs"></i> Track
        </button>
      </form>

      {/* Tracker Status Display */}
      {searched && matchedOrder ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 md:flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Order ID</span>
              <span className="font-mono font-bold text-navy text-sm">{matchedOrder.id}</span>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Expected Delivery</span>
              <span className="font-bold text-navy text-sm">{matchedOrder.deliveryDate}</span>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Current Stage</span>
              <span className="bg-teal/10 text-teal font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider block w-fit mt-0.5">
                {matchedOrder.deliveryStatus}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-premium border border-slate-100">
            <h3 className="font-display font-bold text-base text-navy border-b border-slate-100 pb-3 mb-8">Dispatch Milestones</h3>
            <TrackingTimeline
              currentStatus={matchedOrder.deliveryStatus}
              trackingHistory={matchedOrder.trackingHistory || []}
            />
          </div>
        </div>
      ) : searched ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <i className="fa-solid fa-circle-question text-4xl text-slate-300 mb-4"></i>
          <h4 className="font-display font-bold text-lg text-navy mb-1">Order Not Found</h4>
          <p className="text-slate-500 text-sm">Please verify the Order ID (e.g. ORD-98721).</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <i className="fa-solid fa-truck-moving text-4xl text-slate-300 mb-4"></i>
          <h4 className="font-display font-bold text-lg text-navy mb-1">Awaiting Tracking Query</h4>
          <p className="text-slate-500 text-sm">Search with a valid invoice/order ID above to view live logistics dispatch status.</p>
        </div>
      )}
    </section>
  );
}
