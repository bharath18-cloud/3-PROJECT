import React from 'react';

/**
 * Toast Component
 * Renders a stack of floating notification banners.
 * @param {Array} toasts - Array of { id, message, type } objects
 */
export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-500 ease-in-out pointer-events-auto border-l-4 max-w-sm ${
            t.type === 'success'
              ? 'bg-white border-teal text-navy'
              : t.type === 'error'
              ? 'bg-red-50 border-red-500 text-red-800'
              : t.type === 'warning'
              ? 'bg-yellow-50 border-gold text-yellow-900'
              : 'bg-white border-navy text-navy'
          }`}
        >
          <span className="text-lg flex-shrink-0">
            {t.type === 'success' && <i className="fa-solid fa-circle-check text-teal"></i>}
            {t.type === 'error' && <i className="fa-solid fa-circle-exclamation text-red-500"></i>}
            {t.type === 'warning' && <i className="fa-solid fa-triangle-exclamation text-gold"></i>}
            {!t.type || t.type === 'info' && <i className="fa-solid fa-circle-info text-navy"></i>}
          </span>
          <span className="text-sm font-semibold leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
