import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductImage from '../components/ProductImage';

const getProdId = (p) => p?._id || p?.id;

export default function CartPage({ navigate, addToast }) {
  const { user } = useAuth();
  const {
    cart,
    deliveryDate,
    setDeliveryDate,
    updateQuantity,
    removeFromCart,
    subtotal,
    gst,
    total,
  } = useCart();

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const handleCheckoutClick = () => {
    if (!user) {
      if (addToast) addToast('Please login or register to complete checkout.', 'warning');
      navigate('auth');
      return;
    }
    navigate('checkout');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-navy">Shopping Cart</h1>
        <p className="text-slate-500 text-sm mt-1">Review scheduled logistics and price calculation summaries.</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={getProdId(item.product)} className="bg-white rounded-2xl p-5 shadow-premium border border-slate-100 flex items-center justify-between gap-4">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center p-2 bg-slate-55 rounded-lg">
                  <ProductImage type={item.product.image} />
                </div>
                
                <div className="flex-grow">
                  <span className="text-[10px] bg-slate-100 text-navy font-bold px-2 py-0.5 rounded uppercase">{item.product.brand}</span>
                  <h3 className="font-display font-bold text-sm text-navy mt-1">{item.product.name}</h3>
                  <span className="text-xs text-slate-400 block mt-0.5">Base Price: ₹{item.product.price.toLocaleString('en-IN')}/{item.product.unit}</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                  <button 
                    onClick={() => updateQuantity(getProdId(item.product), item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-navy">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(getProdId(item.product), item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right flex-shrink-0 min-w-[100px]">
                  <span className="text-[10px] text-slate-400 block">Subtotal</span>
                  <span className="font-display font-bold text-sm text-navy">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Remove */}
                <button 
                  onClick={() => removeFromCart(getProdId(item.product))}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))}

            <button 
              onClick={() => navigate('catalog')}
              className="text-teal font-semibold text-sm hover:text-teal-dark flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-arrow-left-long"></i> Add More Materials
            </button>
          </div>

          {/* Summary and Scheduling Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 h-fit space-y-6">
            <div>
              <h3 className="font-display font-bold text-base text-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-truck-ramp-box text-teal"></i> Delivery Scheduling
              </h3>
              <label className="text-xs text-slate-400 font-semibold uppercase block mb-1.5">Preferred Delivery Date</label>
              <input 
                type="date" 
                min={minDate}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
              />
              <p className="text-[10px] text-slate-400 mt-2">
                *Logistics scheduling must be booked at least 48 hours in advance to organize secure flatbed heavy trucks.
              </p>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="font-display font-bold text-base text-navy mb-4">Invoice Calculation Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Materials Net Subtotal</span>
                  <span className="font-semibold text-navy">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18% B2B)</span>
                  <span className="font-semibold text-navy">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Logistics Transport Charge</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <hr className="border-slate-100 my-2" />
                <div className="flex justify-between text-base font-display font-extrabold text-navy">
                  <span>Grand Total (incl. tax)</span>
                  <span className="text-teal">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-glow text-center text-sm"
            >
              Proceed to Checkout <i className="fa-solid fa-arrow-right-long ml-1"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 max-w-lg mx-auto">
          <i className="fa-solid fa-cart-flatbed text-5xl text-slate-300 mb-4"></i>
          <h4 className="font-display font-bold text-lg text-navy mb-1">Your Shopping Cart is Empty</h4>
          <p className="text-slate-500 text-sm mb-6">Select construction rebars or concrete cement bags first.</p>
          <button 
            onClick={() => navigate('catalog')}
            className="bg-navy hover:bg-navy-light text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block text-sm"
          >
            Go to Catalogue
          </button>
        </div>
      )}
    </section>
  );
}
