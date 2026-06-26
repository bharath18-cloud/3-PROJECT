import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, navigate }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('home');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-navy text-white shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
            <div className="bg-teal p-2.5 rounded-lg flex items-center justify-center shadow-glow border border-teal-light">
              <i className="fa-solid fa-trowel-bricks text-xl text-white"></i>
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white block">
                SAI TEJA <span className="text-gold">TRADERS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase block -mt-1">
                Steel & Cement B2B Hub
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 font-medium">
            <button 
              onClick={() => navigate('home')} 
              className={`px-3 py-2 rounded-md text-sm transition-colors ${activePage === 'home' ? 'text-gold' : 'hover:text-teal'}`}
            >
              Home
            </button>
            {(!user || user.role !== 'admin') && (
              <button 
                onClick={() => navigate('catalog')} 
                className={`px-3 py-2 rounded-md text-sm transition-colors ${activePage === 'catalog' ? 'text-gold' : 'hover:text-teal'}`}
              >
                Catalogue
              </button>
            )}
            <button 
              onClick={() => navigate('tracking')} 
              className={`px-3 py-2 rounded-md text-sm transition-colors ${activePage === 'tracking' ? 'text-gold' : 'hover:text-teal'}`}
            >
              Track Order
            </button>
            
            {user && user.role === 'customer' && (
              <button 
                onClick={() => navigate('customer')} 
                className={`px-3 py-2 rounded-md text-sm transition-colors ${activePage === 'customer' ? 'text-gold' : 'hover:text-teal'}`}
              >
                My Dashboard
              </button>
            )}

            {user && user.role === 'admin' && (
              <button 
                onClick={() => navigate('admin')} 
                className={`px-3 py-2 rounded-md text-sm font-semibold text-gold border border-gold/30 bg-gold/10 px-4 py-1.5 rounded-md hover:bg-gold hover:text-navy transition-all duration-300 ${activePage === 'admin' ? 'bg-gold text-navy' : ''}`}
              >
                <i className="fa-solid fa-lock-open mr-1.5"></i>Admin Console
              </button>
            )}
          </nav>

          {/* User Account Controls / Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {user && user.role !== 'admin' && (
              <button 
                onClick={() => navigate('cart')} 
                className="relative p-2.5 rounded-full hover:bg-navy-light text-white transition-colors"
              >
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-navy">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-semibold block text-slate-100">{user.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize block -mt-1">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogoutClick} 
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-sign-out-alt"></i>Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('auth')} 
                className="bg-teal hover:bg-teal-dark text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-glow hover:shadow-lg transition-all duration-300"
              >
                <i className="fa-solid fa-user mr-1.5"></i>Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-3">
            {user && user.role !== 'admin' && (
              <button 
                onClick={() => navigate('cart')} 
                className="relative p-2 text-white"
              >
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md hover:bg-navy-light focus:outline-none"
            >
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-light px-4 pt-2 pb-6 space-y-2">
          <button 
            onClick={() => { navigate('home'); setIsOpen(false); }} 
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-light"
          >
            Home
          </button>
          {(!user || user.role !== 'admin') && (
            <button 
              onClick={() => { navigate('catalog'); setIsOpen(false); }} 
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-light"
            >
              Catalogue
            </button>
          )}
          <button 
            onClick={() => { navigate('tracking'); setIsOpen(false); }} 
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-light"
          >
            Track Order
          </button>
          
          {user && user.role === 'customer' && (
            <button 
              onClick={() => { navigate('customer'); setIsOpen(false); }} 
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-light"
            >
              My Dashboard
            </button>
          )}
          {user && user.role === 'admin' && (
            <button 
              onClick={() => { navigate('admin'); setIsOpen(false); }} 
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gold hover:bg-navy-light"
            >
              Admin Console
            </button>
          )}

          <hr className="border-navy-light my-3" />
          
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="px-3">
                <span className="text-sm font-bold block text-white">{user.name}</span>
                <span className="text-xs text-slate-400 capitalize block">{user.role}</span>
              </div>
              <button 
                onClick={() => { handleLogoutClick(); setIsOpen(false); }} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2 px-3 rounded-md text-center transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { navigate('auth'); setIsOpen(false); }} 
              className="w-full bg-teal text-white font-semibold text-sm py-2.5 px-3 rounded-md text-center transition-colors shadow-glow"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
