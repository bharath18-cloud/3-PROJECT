import React from 'react';

export default function ProductImage({ type }) {
  const imageType = type || 'default-material';
  
  if (imageType.includes('steel')) {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full bg-slate-100 rounded-lg p-4">
        <rect width="120" height="120" fill="#f1f5f9" rx="8" />
        <line x1="20" y1="100" x2="100" y2="20" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
        <line x1="40" y1="100" x2="100" y2="40" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        <line x1="20" y1="80" x2="80" y2="20" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        {/* Rebar ribs */}
        <path d="M 28 92 L 32 96 M 40 80 L 44 84 M 52 68 L 56 72 M 64 56 L 68 60 M 76 44 L 80 48 M 88 32 L 92 36" stroke="#ffffff" strokeWidth="2.5" />
        <path d="M 48 92 L 52 96 M 60 80 L 64 84 M 72 68 L 76 72 M 84 56 L 88 60 M 92 48 L 96 52" stroke="#ffffff" strokeWidth="2.5" />
        <text x="12" y="112" fill="#D4A017" fontSize="10" fontWeight="bold">TMT Fe-550</text>
      </svg>
    );
  }
  
  if (imageType.includes('cement')) {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full bg-slate-100 rounded-lg p-4">
        <rect width="120" height="120" fill="#e2e8f0" rx="8" />
        <polygon points="30,30 90,30 100,90 20,90" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
        <line x1="30" y1="30" x2="90" y2="30" stroke="#ffffff" strokeWidth="2" />
        <rect x="35" y="45" width="50" height="30" fill="#ffffff" rx="3" />
        <text x="40" y="58" fill="#1F3147" fontSize="10" fontWeight="bold">CEMENT</text>
        <text x="45" y="70" fill="#008C95" fontSize="8" fontWeight="black">53 GRADE</text>
        <text x="25" y="112" fill="#475569" fontSize="9" fontWeight="bold">Premium Bag</text>
      </svg>
    );
  }
  
  if (imageType.includes('wire')) {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full bg-slate-100 rounded-lg p-4">
        <rect width="120" height="120" fill="#f1f5f9" rx="8" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="#64748b" strokeWidth="6" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="#475569" strokeWidth="4" />
        <circle cx="60" cy="60" r="25" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <line x1="25" y1="60" x2="95" y2="60" stroke="#334155" strokeWidth="1.5" />
        <line x1="60" y1="25" x2="60" y2="95" stroke="#334155" strokeWidth="1.5" />
        <text x="20" y="112" fill="#64748b" fontSize="9" fontWeight="bold">Gi Binding Wire</text>
      </svg>
    );
  }
  
  // Default spacer block
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full bg-slate-100 rx-lg p-4">
      <rect width="120" height="120" fill="#f1f5f9" rx="8" />
      <rect x="40" y="40" width="40" height="40" fill="#cbd5e1" stroke="#475569" strokeWidth="3" rx="2" />
      <circle cx="50" cy="50" r="5" fill="#94a3b8" />
      <circle cx="70" cy="50" r="5" fill="#94a3b8" />
      <circle cx="50" cy="70" r="5" fill="#94a3b8" />
      <circle cx="70" cy="70" r="5" fill="#94a3b8" />
      <text x="35" y="112" fill="#475569" fontSize="10" fontWeight="bold">Spacer block</text>
    </svg>
  );
}
