import React from 'react';
import ProductImage from '../components/ProductImage';

export default function HomePage({ navigate, pricesHistory, products, setSelectedProductId }) {
  const featuredList = products ? products.slice(0, 3) : [];
  const prices = pricesHistory || [
    { category: 'Steel TMT Bars', currentPrice: 54500, previousPrice: 55000, lastUpdated: 'Today' },
    { category: 'Cement', currentPrice: 425, previousPrice: 420, lastUpdated: 'Today' },
    { category: 'Binding Wire', currentPrice: 7900, previousPrice: 7850, lastUpdated: 'Yesterday' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-navy text-white overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#008C95 1.5px, transparent 1.5px), radial-gradient(#008C95 1.5px, #1F3147 1.5px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left md:flex items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/40 px-3.5 py-1.5 rounded-full text-teal-light text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-teal pulse-glow"></span>
              ISO 9001:2015 Certified B2B Supplier
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-4 leading-tight">
              Your Trusted Steel & <br/>
              <span className="text-teal">Cement Supply</span> Partner
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Powering infrastructure and real estate across India with premium grade cement bags and dynamic-tested, high-ductility TMT Steel rebars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate('catalog')} 
                className="bg-teal hover:bg-teal-dark text-white font-bold px-8 py-4 rounded-xl shadow-glow hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Browse Products <i className="fa-solid fa-arrow-right"></i>
              </button>
              <a 
                href="#contact" 
                className="bg-navy-light hover:bg-navy border border-slate-700 text-white font-bold px-8 py-4 rounded-xl hover:border-teal transition-all duration-300 text-center"
              >
                Get B2B Quote
              </a>
            </div>
          </div>

          {/* Live Daily Prices Card */}
          <div className="mt-12 md:mt-0 bg-navy-dark/95 border border-slate-800 rounded-2xl p-6 shadow-premium max-w-sm mx-auto w-full">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-teal"></i> Live Daily Prices
              </h3>
              <span className="text-[10px] bg-teal/15 text-teal px-2 py-0.5 rounded font-bold uppercase">Dynamic</span>
            </div>
            <div className="space-y-4">
              {prices.map((p, idx) => {
                const diff = p.currentPrice - p.previousPrice;
                return (
                  <div key={idx} className="flex justify-between items-center bg-navy-light/40 p-3 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">{p.category}</span>
                      <span className="font-display font-extrabold text-base text-white">
                        ₹{p.currentPrice.toLocaleString('en-IN')}/{p.category.includes('Cement') ? 'Bag' : p.category.includes('Wire') ? 'Bundle' : 'Ton'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold flex items-center gap-1 ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <i className={`fa-solid ${diff >= 0 ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                        {diff >= 0 ? '+' : ''}{diff.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 block">vs yesterday</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-4">
              *GST (18%) and transport logistics applicable extra.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal mb-2">About Our Platform</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-navy">
              Revolutionizing Industrial Material Sourcing
            </h3>
            <p className="mt-4 text-slate-500 leading-relaxed text-sm">
              Sai Teja Traders bridges the gap between major steel plants and cement manufacturers, and the construction developers who build our homes and cities. We provide bulk pricing, dynamic updates, and streamlined order logistics in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-lightBg hover:bg-white hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal text-xl mb-6">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4 className="font-display font-bold text-lg mb-3">100% Certified Grades</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                We deliver certified structural materials including JSW NeoSteel Fe-550D and UltraTech cement grades with mill certificate reports.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-lightBg hover:bg-white hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-xl mb-6">
                <i className="fa-solid fa-truck-moving"></i>
              </div>
              <h4 className="font-display font-bold text-lg mb-3">Scheduled Delivery</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Book orders with designated delivery dates. Choose dates matching your slab casting schedules to minimize site clutter.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-lightBg hover:bg-white hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal text-xl mb-6">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <h4 className="font-display font-bold text-lg mb-3">GST-Compliant Invoicing</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every order triggers automated dynamic generation of tax invoices specifying CGST/SGST with custom corporate GSTIN support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-lightBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal mb-2">High Demand</h2>
              <h3 className="text-3xl font-display font-bold text-navy">Featured Materials</h3>
            </div>
            <button 
              onClick={() => navigate('catalog')} 
              className="text-teal font-semibold text-sm hover:text-teal-dark flex items-center gap-1.5 transition-colors"
            >
              View All Products <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredList.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="h-48 w-full p-4 flex items-center justify-center">
                  <ProductImage type={prod.image} />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] bg-slate-100 text-navy font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {prod.brand}
                    </span>
                    <span className="text-xs text-slate-500">{prod.grade}</span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-navy mb-3 line-clamp-1">{prod.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{prod.spec}</p>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Live Price</span>
                      <span className="font-display font-extrabold text-navy text-lg">
                        ₹{prod.price.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500"> / {prod.unit}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => { setSelectedProductId(prod.id); navigate('catalog'); }}
                      className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy text-white rounded-3xl overflow-hidden shadow-premium grid grid-cols-1 lg:grid-cols-2 border border-slate-800">
            <div className="p-8 sm:p-12 lg:p-16">
              <h3 className="font-display font-extrabold text-3xl mb-4">Get an Instant Quote</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Need customized bulk supply pricing for high-tonnage construction orders? Reach out directly and our sales executives will generate a custom quote within 2 hours.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('B2B Quote inquiry successfully sent!'); }} className="space-y-4 text-navy">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" required className="bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                  <input type="tel" placeholder="Mobile Number" required className="bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <input type="email" placeholder="Business Email" required className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                <textarea placeholder="Specify requirements (e.g. 50 Tons JSW Rebar, 200 bags Cement)" rows="3" required className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"></textarea>
                <button type="submit" className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-glow uppercase tracking-wider text-xs">
                  Submit Quote Request
                </button>
              </form>
            </div>
            
            <div className="p-8 sm:p-12 lg:p-16 bg-navy-light/60 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
              <div>
                <h4 className="font-display font-bold text-xl mb-6 text-teal-light">Sales Office Hours</h4>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span>Monday - Saturday</span>
                    <span className="font-semibold text-white">09:00 AM - 07:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span>Sunday Logistics Depot</span>
                    <span className="font-semibold text-gold">Closed (Dispatches only)</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>GSTIN Reference</span>
                    <span className="font-semibold text-slate-400">36AAAAA1111A1Z1</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs text-slate-400 mb-2">Registered Warehouse Location</p>
                <p className="text-sm font-semibold text-white">
                  Sai Teja Warehousing Complex, Industrial Estate, Jeedimetla, Hyderabad, Telangana, 500055
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
