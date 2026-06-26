import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard({ orders, navigate, setTrackingOrderId, setSelectedOrderForInvoice }) {
  const { user } = useAuth();

  const myOrders = useMemo(() => {
    if (!user || !orders) return [];
    return orders.filter(
      (o) => o.customerMobile === user.mobile || o.customerName.toLowerCase() === user.name.toLowerCase() || o.customerMobile === '9876543210'
    );
  }, [user, orders]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-navy">Customer Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage profile addresses, access digital invoices, and track orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 h-fit space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-teal text-white flex items-center justify-center font-display font-black text-2xl mx-auto mb-3 shadow">
              {user?.name ? user.name[0].toUpperCase() : 'C'}
            </div>
            <h3 className="font-display font-bold text-base text-navy">{user?.name || 'Customer Builder'}</h3>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user?.role || 'customer'} account</span>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-3.5 text-xs text-slate-500">
            <div>
              <span className="text-slate-400 block uppercase font-bold mb-0.5">Email</span>
              <span className="text-navy font-semibold">{user?.email || 'builder@saiteja.com'}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold mb-0.5">Mobile Contact</span>
              <span className="text-navy font-semibold">{user?.mobile || '9876543210'}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold mb-0.5">Corporate GSTIN</span>
              <span className="text-navy font-semibold uppercase">{user?.gstin || 'Not Provided (B2C Order)'}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold mb-0.5">Default Shipping Address</span>
              <span className="text-navy font-semibold">{user?.address || 'Site address not configured.'}</span>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-bold text-lg text-navy mb-4 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-teal"></i> Purchase Order History
          </h3>

          {myOrders.length > 0 ? (
            myOrders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-5 shadow-premium border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-navy">{o.id}</span>
                    <span className="text-xs text-slate-400">Placed: {o.date}</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {o.items.map((it) => `${it.quantity} ${it.unit} x ${it.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="font-display font-extrabold text-navy text-sm">
                      ₹{o.total.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      o.deliveryStatus === 'Delivered' 
                        ? 'bg-green-100 text-green-700' 
                        : o.deliveryStatus === 'Processing' 
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-teal/10 text-teal'
                    }`}>
                      {o.deliveryStatus}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => { if (setTrackingOrderId) setTrackingOrderId(o.id); navigate('tracking'); }}
                    className="flex-grow md:flex-none bg-slate-100 hover:bg-slate-200 text-navy text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <i className="fa-solid fa-map-location-dot"></i> Track
                  </button>
                  <button 
                    onClick={() => { if (setSelectedOrderForInvoice) setSelectedOrderForInvoice(o); }}
                    className="flex-grow md:flex-none bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-glow transition-colors flex items-center justify-center gap-1"
                  >
                    <i className="fa-solid fa-file-invoice-dollar"></i> Invoice
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <i className="fa-solid fa-receipt text-4xl text-slate-300 mb-4"></i>
              <h4 className="font-display font-bold text-lg text-navy mb-1">No Orders Placed Yet</h4>
              <p className="text-slate-500 text-sm">Visit the catalogue page to place your first B2B purchase order.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
