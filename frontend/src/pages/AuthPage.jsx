import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ navigate, addToast }) {
  const { login, register, verifyOtp } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('customer');

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [tempRegData, setTempRegData] = useState(null);
  const [expectedOtp, setExpectedOtp] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const res = await login({ email, password });
      if (res.success) {
        if (addToast) addToast('Successfully logged in.');
        // Direct to admin or catalog page based on user profiles
        if (email.includes('admin')) {
          navigate('admin');
        } else {
          navigate('catalog');
        }
      } else {
        if (addToast) addToast(res.message, 'error');
      }
    } else {
      const res = await register({ name, email, password, role, mobile });
      if (res.success) {
        setTempRegData(res.tempData);
        setExpectedOtp(res.mockOtpCode.toString());
        setShowOtpScreen(true);
        if (addToast) addToast(res.message);
      } else {
        if (addToast) addToast(res.message, 'error');
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const res = await verifyOtp({ 
      otp: expectedOtp, 
      enteredOtp: otpVal, 
      userDetails: tempRegData 
    });

    if (res.success) {
      if (addToast) addToast('Registration complete!');
      setShowOtpScreen(false);
      if (role === 'admin') {
        navigate('admin');
      } else {
        navigate('catalog');
      }
    } else {
      if (addToast) addToast(res.message, 'error');
    }
  };

  return (
    <section className="py-16 max-w-md mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100 relative">
        {!showOtpScreen ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-display font-extrabold text-2xl text-navy">
                {isLogin ? 'Welcome Back' : 'Create B2B Account'}
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {isLogin ? 'Log in to view live structural steel pricing' : 'Register your corporate firm for tax inputs'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-semibold text-slate-400">
              {!isLogin && (
                <>
                  <div>
                    <label className="block mb-1.5 uppercase">Authorized Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Sai Teja"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 uppercase">Business Mobile Contact</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 uppercase">Account Role Type</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-semibold"
                    >
                      <option value="customer">Contractor / Customer</option>
                      <option value="admin">Platform Admin Manager</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block mb-1.5 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="uppercase">Password</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => alert('Forgot Password simulation: Check email for verification link.')}
                      className="text-teal hover:underline text-[10px] lowercase"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-glow text-center text-xs uppercase tracking-wider mt-4"
              >
                {isLogin ? 'Login Securely' : 'Request OTP Verification'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-slate-500">
              {isLogin ? (
                <span>Don't have a B2B account? <button onClick={() => setIsLogin(false)} className="text-teal font-semibold hover:underline">Register Here</button></span>
              ) : (
                <span>Already registered? <button onClick={() => setIsLogin(true)} className="text-teal font-semibold hover:underline">Login Here</button></span>
              )}
              
              <div className="mt-6 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left text-[11px] leading-relaxed">
                <strong className="text-navy block mb-1"><i className="fa-solid fa-circle-info text-teal mr-1"></i> Quick Test Accounts:</strong>
                <div className="flex justify-between">
                  <span>Customer: <strong>customer@saiteja.com</strong></span>
                  <span>Pass: <strong>customer123</strong></span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Admin Portal: <strong>admin@saiteja.com</strong></span>
                  <span>Pass: <strong>admin123</strong></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // OTP Screen
          <div>
            <div className="text-center mb-8">
              <h2 className="font-display font-extrabold text-2xl text-navy">OTP Verification</h2>
              <p className="text-slate-400 text-xs mt-1">We sent a verification SMS to your phone <strong>{mobile}</strong>.</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs font-semibold text-slate-400">
              <div>
                <label className="block mb-1.5 uppercase">Enter 4-Digit OTP Code</label>
                <input 
                  type="text" 
                  required
                  maxLength="4"
                  placeholder="e.g. 1234"
                  value={otpVal}
                  onChange={(e) => setOtpVal(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal border border-slate-100 font-bold text-center tracking-widest"
                />
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  *Please type <strong>{expectedOtp}</strong> to verify the OTP.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-glow text-center text-xs uppercase tracking-wider"
              >
                Confirm OTP & Register
              </button>

              <button 
                type="button" 
                onClick={() => setShowOtpScreen(false)}
                className="w-full bg-slate-200 text-navy font-semibold py-2.5 rounded-xl text-center text-xs transition-colors"
              >
                Cancel Registration
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
