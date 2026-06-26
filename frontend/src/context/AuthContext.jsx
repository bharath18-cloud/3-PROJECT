import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// ─── Local storage helpers ────────────────────────────────────────────────────
const USERS_KEY  = 'st_users_db';
const TOKEN_KEY  = 'st_token';
const USER_KEY   = 'st_current_user';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [
      { id: 'u1', name: 'Admin Sai Teja', email: 'admin@saiteja.com',    password: 'admin123',    role: 'admin',    mobile: '9000012345', gstin: '36AAAAA1111A1Z1', address: 'Jeedimetla, Hyderabad' },
      { id: 'u2', name: 'Bharath Kumar',  email: 'customer@saiteja.com', password: 'customer123', role: 'customer', mobile: '9876543210', gstin: '36BBBBB2222B2Z2', address: 'Hitec City, Hyderabad' },
    ];
  } catch { return []; }
};

const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      const { password: _pw, ...safeUser } = found;
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem(TOKEN_KEY, `mock-token-${safeUser.id}-${Date.now()}`);
      setUser(safeUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password. Check Quick Test Accounts below.' };
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async ({ name, email, password, role, mobile }) => {
    if (!name || !email || !password || !mobile) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists. Please login.' };
    }

    const mockOtpCode = Math.floor(1000 + Math.random() * 9000);
    const tempData    = { name, email, password, role, mobile, id: `u${Date.now()}` };

    return {
      success: true,
      message: `OTP sent to ${mobile}. Use the code shown to verify.`,
      tempData,
      mockOtpCode,
    };
  };

  // ── Verify OTP & complete registration ────────────────────────────────────
  const verifyOtp = async ({ otp, enteredOtp, userDetails }) => {
    if (otp !== enteredOtp) {
      return { success: false, message: 'Incorrect OTP. Please try again.' };
    }

    const users = getUsers();
    const { password: _pw, ...safeUser } = userDetails;
    users.push(userDetails);
    saveUsers(users);

    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(TOKEN_KEY, `mock-token-${safeUser.id}-${Date.now()}`);
    setUser(safeUser);
    return { success: true };
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
