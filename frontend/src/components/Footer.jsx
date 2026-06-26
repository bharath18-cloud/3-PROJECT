import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer className="bg-navy text-slate-300 border-t-4 border-teal pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal p-2 rounded-lg text-white">
              <i className="fa-solid fa-trowel-bricks text-lg"></i>
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-white">
              SAI TEJA <span className="text-gold">TRADERS</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
            Sai Teja Traders is India's leading digital platform supplying premium quality TMT steel bars, binding wire, and cement products directly to B2B building contractors, infrastructure developers, and builders.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-navy-light text-slate-400 hover:text-teal hover:bg-white transition-all"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="p-2 rounded-full bg-navy-light text-slate-400 hover:text-teal hover:bg-white transition-all"><i className="fa-brands fa-linkedin-in"></i></a>
            <a href="#" className="p-2 rounded-full bg-navy-light text-slate-400 hover:text-teal hover:bg-white transition-all"><i className="fa-brands fa-twitter"></i></a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-white font-bold text-sm uppercase tracking-wider mb-4">Product Catalog</h3>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><button onClick={() => navigate('catalog')} className="hover:text-teal transition-colors">Steel TMT Rebars</button></li>
            <li><button onClick={() => navigate('catalog')} className="hover:text-teal transition-colors">OPC & PPC Cements</button></li>
            <li><button onClick={() => navigate('catalog')} className="hover:text-teal transition-colors">Binding Galvanized Wire</button></li>
            <li><button onClick={() => navigate('catalog')} className="hover:text-teal transition-colors">Construction Spacer Blocks</button></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Support</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <i className="fa-solid fa-location-dot text-teal mt-1"></i>
              <span className="text-slate-400 text-xs">D-No 12-42, Industrial Area, Jeedimetla, Hyderabad, Telangana, 500055</span>
            </li>
            <li className="flex items-center gap-2.5">
              <i className="fa-solid fa-phone text-teal"></i>
              <span className="text-slate-400 font-semibold">+91 90001 23456</span>
            </li>
            <li className="flex items-center gap-2.5">
              <i className="fa-solid fa-envelope text-teal"></i>
              <span className="text-slate-400">info@saitejatraders.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-light mt-12 pt-6 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2026 Sai Teja Traders. All Rights Reserved. GSTIN: 36AAAAA1111A1Z1.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-teal">Terms & Conditions</a>
          <a href="#" className="hover:text-teal">Privacy Policy</a>
          <a href="#" className="hover:text-teal">GST Invoicing Policy</a>
        </div>
      </div>
    </footer>
  );
}
