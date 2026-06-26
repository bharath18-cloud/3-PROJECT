import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wraps a page and enforces authentication/role requirements.
 * @param {React.ReactNode} children   - Content to render if access is allowed
 * @param {'admin'|'customer'} role    - Required role. If omitted, only login is required.
 * @param {Function} navigate          - Navigation function
 * @param {Function} addToast          - Toast notification callback
 */
export default function ProtectedRoute({ children, role, navigate, addToast }) {
  const { user, loading } = useAuth();

  // While auth state is loading, show a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-teal mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-slate-400 font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    if (addToast) addToast('Please log in to access this page.', 'warning');
    if (navigate) navigate('auth');
    return null;
  }

  // Logged in but wrong role
  if (role && user.role !== role) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-white rounded-3xl p-12 text-center shadow-premium border border-slate-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 text-2xl mx-auto mb-4">
            <i className="fa-solid fa-shield-xmark"></i>
          </div>
          <h2 className="font-display font-extrabold text-xl text-navy mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Your <strong className="capitalize">{user.role}</strong> account does not have permission to view this page.
            {role === 'admin' && ' Please contact the platform administrator.'}
          </p>
          <button
            onClick={() => navigate && navigate('home')}
            className="bg-teal hover:bg-teal-dark text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-glow"
          >
            <i className="fa-solid fa-house mr-1.5"></i> Return Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
