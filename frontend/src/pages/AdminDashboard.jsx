import React, { useState, useMemo } from 'react';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  pricesHistory, 
  setPricesHistory, 
  addToast, 
  setSelectedOrderForInvoice 
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'prices'
  const [newPriceValue, setNewPriceValue] = useState('');
  const [selectedPriceCat, setSelectedPriceCat] = useState('Steel TMT Bars');

  // Aggregate stats
  const totalSales = useMemo(() => orders ? orders.reduce((sum, o) => sum + o.total, 0) : 0, [orders]);
  const revenue = useMemo(() => orders ? orders.reduce((sum, o) => sum + o.subtotal, 0) : 0, [orders]);
  const lowStockAlerts = useMemo(() => products ? products.filter(p => p.stock <= p.lowStock).length : 0, [products]);
  const activeOrdersCount = useMemo(() => orders ? orders.filter(o => o.deliveryStatus !== 'Delivered').length : 0, [orders]);

  const handleUpdatePrice = (e) => {
    e.preventDefault();
    const price = parseInt(newPriceValue);
    if (!price || price <= 0) {
      if (addToast) addToast('Please enter a valid price!', 'error');
      return;
    }

    // Update index pricing history log
    const updatedHistory = pricesHistory.map((item) => {
      if (item.category === selectedPriceCat) {
        return {
          ...item,
          previousPrice: item.currentPrice,
          currentPrice: price,
          lastUpdated: 'Just Now'
        };
      }
      return item;
    });

    // Update catalog prices
    const updatedProducts = products.map((prod) => {
      if (prod.category === selectedPriceCat) {
        const oldCatPrice = pricesHistory.find(i => i.category === selectedPriceCat).currentPrice;
        const multiplier = price / oldCatPrice;
        return {
          ...prod,
          price: Math.round(prod.price * multiplier)
        };
      }
      return prod;
    });

    if (setPricesHistory) setPricesHistory(updatedHistory);
    if (setProducts) setProducts(updatedProducts);
    setNewPriceValue('');
    if (addToast) addToast(`Live prices for ${selectedPriceCat} updated system-wide.`);
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    const commentForStep = {
      'Order Confirmed': 'Order confirmed via selected payment gateway.',
      'Processing': 'Materials allocated and packed at logistics yard.',
      'Dispatched': 'Flatbed heavy truck left Jeedimetla logistics warehouse.',
      'Out for Delivery': 'Vehicle arrived at customer local delivery perimeter.',
      'Delivered': 'Shipment unloaded. Digital proof of delivery receipt registered.'
    };

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        const exists = o.trackingHistory.some((h) => h.status === newStatus);
        let updatedHistory = [...o.trackingHistory];
        if (!exists) {
          updatedHistory.push({
            status: newStatus,
            time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            comment: commentForStep[newStatus] || 'Status changed by Admin.'
          });
        }
        return {
          ...o,
          deliveryStatus: newStatus,
          trackingHistory: updatedHistory
        };
      }
      return o;
    });

    if (setOrders) setOrders(updatedOrders);
    if (addToast) addToast(`Order ${orderId} status changed to ${newStatus}.`);
  };

  const handleAddStock = (prodId, amt) => {
    const val = parseInt(amt);
    if (!val || val <= 0) return;
    const updated = products.map((p) => {
      if (p.id === prodId) {
        return { ...p, stock: p.stock + val };
      }
      return p;
    });
    if (setProducts) setProducts(updated);
    if (addToast) addToast(`Added ${val} units of stock.`);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-navy">Admin Management Console</h1>
        <p className="text-slate-500 text-sm mt-1">Manage bulk stocks, adjust live market prices, and process B2B invoices.</p>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label="Total Sales (incl. GST)"
          value={`₹${totalSales.toLocaleString('en-IN')}`}
          icon="fa-indian-rupee-sign"
          trend="+12%"
          trendDirection="up"
          subLabel="vs last week"
        />
        <StatsCard
          label="Net Revenue (excl. GST)"
          value={`₹${revenue.toLocaleString('en-IN')}`}
          icon="fa-chart-pie"
          subLabel="Excl. 18% dynamic GST"
        />
        <StatsCard
          label="Active Orders"
          value={activeOrdersCount}
          icon="fa-truck-fast"
          trend={activeOrdersCount > 0 ? `${activeOrdersCount} pending` : 'All clear'}
          trendDirection={activeOrdersCount > 0 ? 'neutral' : 'up'}
          subLabel="Awaiting dispatch fulfillment"
        />
        <StatsCard
          label="Low Stock Alerts"
          value={lowStockAlerts}
          icon="fa-triangle-exclamation"
          trend={lowStockAlerts > 0 ? `${lowStockAlerts} items` : 'Fully stocked'}
          trendDirection={lowStockAlerts > 0 ? 'down' : 'up'}
          subLabel="Warehouse replenishment alerts"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-4">
        {[
          { id: 'orders', label: 'Order Processing', icon: 'fa-truck-fast' },
          { id: 'inventory', label: 'Inventory Stocks', icon: 'fa-warehouse' },
          { id: 'prices', label: 'Price Controller', icon: 'fa-coins' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 font-display font-semibold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-teal text-teal' 
                : 'border-transparent text-slate-400 hover:text-navy'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 pb-3 gap-3">
                  <div>
                    <span className="font-mono font-bold text-sm text-navy">{o.id}</span>
                    <span className="text-xs text-slate-400 block sm:inline sm:ml-3">Customer: <strong>{o.customerName}</strong> ({o.customerMobile})</span>
                  </div>
                  
                  <div className="flex gap-2 items-center w-full md:w-auto">
                    <label className="text-xs text-slate-400 font-bold uppercase whitespace-nowrap">Status:</label>
                    <select
                      value={o.deliveryStatus}
                      onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-navy font-semibold focus:outline-none focus:ring-1 focus:ring-teal"
                    >
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button
                      onClick={() => { if (setSelectedOrderForInvoice) setSelectedOrderForInvoice(o); }}
                      className="bg-teal text-white hover:bg-teal-dark font-bold text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 shadow"
                    >
                      <i className="fa-solid fa-file-pdf"></i> Invoice
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase font-semibold">Delivery Address</span>
                    <p className="text-navy mt-0.5 leading-relaxed">{o.deliveryAddress}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-semibold">Purchased Items</span>
                    <ul className="text-navy mt-0.5 list-disc pl-4 space-y-0.5">
                      {o.items.map((it, idx) => (
                        <li key={idx}><strong>{it.quantity} {it.unit}</strong> - {it.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-semibold">Billing</span>
                    <div className="text-navy mt-0.5">
                      <p>Subtotal: ₹{o.subtotal.toLocaleString('en-IN')}</p>
                      <p>GST: ₹{o.gst.toLocaleString('en-IN')}</p>
                      <p className="font-bold text-teal mt-0.5">Total: ₹{o.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <h4 className="font-display font-bold text-lg text-navy mb-1">No Orders Registered</h4>
              <p className="text-slate-500 text-sm">Waiting for incoming customer transactions...</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 uppercase text-[10px] font-bold">
                <th className="p-4">Material Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Levels</th>
                <th className="p-4">Current Price</th>
                <th className="p-4 text-center">Reorder Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-navy">
              {products && products.map((p) => {
                const isLow = p.stock <= p.lowStock;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <span className="font-bold text-sm block">{p.name}</span>
                      <span className="text-slate-400 text-xs block">Brand: {p.brand} | Grade: {p.grade}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-500">{p.category}</td>
                    <td className="p-4">
                      <span className={`font-bold ${isLow ? 'text-yellow-600' : 'text-navy'}`}>
                        {p.stock.toLocaleString('en-IN')} {p.unit}s
                      </span>
                      {isLow && (
                        <span className="block text-[10px] text-yellow-600 font-bold mt-0.5">
                          <i className="fa-solid fa-triangle-exclamation mr-1"></i> Low Stock Threshold ({p.lowStock})
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-semibold">₹{p.price.toLocaleString('en-IN')}/{p.unit}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <input 
                          type="number" 
                          id={`stock-add-admin-${p.id}`}
                          placeholder="+Qty" 
                          className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center font-bold text-xs" 
                        />
                        <button
                          onClick={() => {
                            const el = document.getElementById(`stock-add-admin-${p.id}`);
                            handleAddStock(p.id, el.value);
                            el.value = '';
                          }}
                          className="bg-navy hover:bg-navy-light text-white text-[10px] font-bold py-1 px-3 rounded"
                        >
                          Add
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Prices */}
      {activeTab === 'prices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Price adjuster */}
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
            <h3 className="font-display font-bold text-base text-navy border-b border-slate-100 pb-3 mb-4">
              Adjust Base Market Prices
            </h3>
            <form onSubmit={handleUpdatePrice} className="space-y-4 text-xs font-semibold text-slate-400">
              <div>
                <label className="block mb-1.5 uppercase">Select Commodity Category</label>
                <select
                  value={selectedPriceCat}
                  onChange={(e) => setSelectedPriceCat(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-semibold"
                >
                  <option value="Steel TMT Bars">Steel TMT Bars (Fe-550D / Fe-550SD)</option>
                  <option value="Cement">Cement (Grade 53 / PPC Bags)</option>
                  <option value="Binding Wire">Binding Wire (Bundles)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 uppercase">New Base Price (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 55000 for Steel or 430 for Cement"
                  value={newPriceValue}
                  onChange={(e) => setNewPriceValue(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-mono font-semibold"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-glow uppercase text-xs tracking-wider"
              >
                Apply Live Price Update
              </button>
            </form>
          </div>

          {/* Pricing logs */}
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
            <h3 className="font-display font-bold text-base text-navy border-b border-slate-100 pb-3 mb-4">
              Current Live Pricing Index
            </h3>
            <div className="space-y-4">
              {pricesHistory && pricesHistory.map((p, idx) => {
                const diff = p.currentPrice - p.previousPrice;
                return (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">{p.category}</span>
                      <span className="font-display font-black text-base text-navy">
                        ₹{p.currentPrice.toLocaleString('en-IN')}/{p.category.includes('Cement') ? 'Bag' : p.category.includes('Wire') ? 'Bundle' : 'Ton'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {diff >= 0 ? '+' : ''}{diff.toLocaleString('en-IN')} ({p.previousPrice ? Math.round(diff/p.previousPrice*100) : 0}%)
                      </span>
                      <span className="text-[10px] text-slate-400">Last updated: {p.lastUpdated}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
