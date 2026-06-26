import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductImage from '../components/ProductImage';

const getProdId = (p) => p?._id || p?.id;

export default function CheckoutPage({ navigate, addToast, onOrderSuccess }) {
  const { user } = useAuth();
  const { cart, deliveryDate, subtotal, gst, total, clearCart } = useCart();

  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [gstin, setGstin] = useState(user?.gstin || '');
  const [address, setAddress] = useState(user?.address || '');
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      if (addToast) addToast('Cart is empty!', 'error');
      navigate('catalog');
      return;
    }

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      customerName: name,
      customerMobile: mobile,
      customerGST: gstin || 'N/A',
      deliveryAddress: address,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: deliveryDate,
      items: cart.map(item => ({
        productId: getProdId(item.product),
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit
      })),
      subtotal,
      gst,
      total,
      paymentMethod: 'WhatsApp',
      paymentStatus: 'Pending',
      deliveryStatus: 'Order Confirmed',
      trackingHistory: [
        { 
          status: 'Order Confirmed', 
          time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), 
          comment: `Order confirmed. Complete details shared via WhatsApp.` 
        }
      ]
    };

    // Format items list for WhatsApp message
    const itemsText = cart.map(item => 
      `• ${item.product.name} (${item.quantity} ${item.product.unit}s x ₹${item.product.price.toLocaleString('en-IN')}) = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    // Create WhatsApp message
    const message = `Hello Sai Teja Traders! I would like to place a bulk order.

*Order Details:*
• *Order ID:* ${orderId}
• *Authorized Name:* ${name}
• *Mobile Contact:* ${mobile}
• *GSTIN:* ${gstin || 'N/A'}
• *Site Delivery Address:* ${address}
• *Scheduled Delivery Date:* ${deliveryDate}

*Items Ordered:*
${itemsText}

• *Subtotal:* ₹${subtotal.toLocaleString('en-IN')}
• *GST (18%):* ₹${gst.toLocaleString('en-IN')}
• *Total Tax-Paid Bill:* ₹${total.toLocaleString('en-IN')}

Please confirm the order and share payment instructions. Thank you!`;

    // WhatsApp URL (using the business number +91 93478 06042)
    const whatsappUrl = `https://wa.me/919347806042?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }
    clearCart();
    if (addToast) addToast(`Order ${orderId} placed successfully! Sharing on WhatsApp...`);
    navigate('customer');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-navy">Checkout</h1>
        <p className="text-slate-500 text-sm mt-1">Provide delivery specifications and complete safe payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder} className="bg-white rounded-2xl p-6 sm:p-8 shadow-premium border border-slate-100 space-y-6">
            <h3 className="font-display font-bold text-lg text-navy border-b border-slate-100 pb-3 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-address-card text-teal"></i> B2B Customer & Shipping Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold uppercase text-slate-400">
              <div>
                <label className="block mb-1.5">Authorized Name *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                />
              </div>
              <div>
                <label className="block mb-1.5">Mobile Contact *</label>
                <input 
                  type="tel" 
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                />
              </div>
            </div>

            <div className="text-xs font-semibold uppercase text-slate-400">
              <label className="block mb-1.5">GST Identification Number (GSTIN) <span className="text-[10px] text-slate-400">(Optional for Input Credit)</span></label>
              <input 
                type="text" 
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium uppercase"
                placeholder="e.g. 36AAAAA1111A1Z1"
              />
            </div>

            <div className="text-xs font-semibold uppercase text-slate-400">
              <label className="block mb-1.5">Site Delivery Address *</label>
              <textarea 
                rows="3"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                placeholder="Provide full site address with pin code..."
              />
            </div>

            <div className="bg-green-50 rounded-2xl p-5 border border-green-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg flex-shrink-0">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-green-800">Order via WhatsApp</h4>
                <p className="text-xs text-green-600/90 leading-relaxed mt-0.5">
                  Confirming your order will generate your GST invoice, save it to your dashboard, and redirect you to WhatsApp where you can share details directly with our team for final confirmation and dispatch.
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-glow text-center text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> Confirm Order & Share on WhatsApp
            </button>
          </form>
        </div>

        {/* Sidebar calculations */}
        <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 h-fit space-y-6">
          <div>
            <h3 className="font-display font-bold text-base text-navy border-b border-slate-100 pb-3 mb-4">Logistics Summary</h3>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-slate-400">Scheduled Date</span>
              <span className="font-bold text-navy">{deliveryDate}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Items In Shipment</span>
              <span className="font-bold text-navy">{cart.reduce((sum, item) => sum + item.quantity, 0)} Units</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h3 className="font-display font-bold text-base text-navy mb-4">Item Details</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={getProdId(item.product)} className="flex justify-between items-start gap-2 text-xs border-b border-slate-50 pb-2">
                  <div>
                    <span className="font-bold text-navy block">{item.product.name}</span>
                    <span className="text-slate-400 font-medium">{item.quantity} {item.product.unit} x ₹{item.product.price}</span>
                  </div>
                  <span className="font-semibold text-navy">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-2 text-xs font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Materials Subtotal</span>
              <span className="text-navy font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span className="text-navy font-bold">₹{Math.round(gst/2).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span className="text-navy font-bold">₹{Math.round(gst/2).toLocaleString('en-IN')}</span>
            </div>
            <hr className="border-slate-100 my-2" />
            <div className="flex justify-between text-sm font-display font-extrabold text-navy">
              <span>Total Payable</span>
              <span className="text-teal">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
