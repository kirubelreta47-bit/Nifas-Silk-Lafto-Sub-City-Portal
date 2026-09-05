import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  User, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Building2,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  setAdminAuthenticatedSession, 
  checkLoginRateLimit, 
  recordFailedLogin, 
  resetLoginAttempts,
  sanitizeText
} from '../utils/security';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const { language } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSec, setLockoutSec] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check rate limiting on mount & interval
  useEffect(() => {
    const checkStatus = () => {
      const { isLocked, remainingSec } = checkLoginRateLimit();
      if (isLocked) {
        setLockoutSec(remainingSec);
      } else {
        setLockoutSec(0);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Rate-limit check
    const { isLocked, remainingSec } = checkLoginRateLimit();
    if (isLocked) {
      setErrorMessage(`Too many failed attempts. Security lock active for ${remainingSec}s.`);
      return;
    }

    const cleanUser = sanitizeText(username);
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Username and password are required.');
      return;
    }

    setIsSubmitting(true);

    // Timing-delay simulation for anti-timing analysis attack
    setTimeout(() => {
      setIsSubmitting(false);

      // Verify credentials: username 'admin', password 'admin123'
      if (cleanUser === 'admin' && cleanPass === 'admin123') {
        resetLoginAttempts();
        setAdminAuthenticatedSession();
        onLoginSuccess();
      } else {
        const { isLocked, remainingSec } = recordFailedLogin();
        if (isLocked) {
          setLockoutSec(remainingSec);
          setErrorMessage(`Access Denied. Account locked due to 5 consecutive failed attempts. Try again in ${remainingSec}s.`);
        } else {
          setErrorMessage('Invalid administrator credentials. Access has been logged.');
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#0f172a] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      
      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0348AB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Back to Public Portal' : 'ወደ ዋናው ፖርታል ተመለስ'}</span>
        </button>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        {/* Security watermark bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#14274E]" />

        {/* Card Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#14274E] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#14274E] tracking-tight">
              {language === 'en' ? 'Administrative Gateway' : 'የአስተዳዳሪ መግቢያ'}
            </h2>
            <p className="text-xs text-[#6B6558] mt-1">
              {language === 'en' 
                ? 'Nifas Silk-Lafto Sub-City Restricted Access' 
                : 'የነፋስ ስልክ ላፍቶ ክፍለ ከተማ የተጠበቀ መስኮት'}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-[#0348AB] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure TLS Session Protected</span>
          </div>
        </div>

        {/* Lockout alert */}
        {lockoutSec > 0 && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Security Lockout active. Retry in {lockoutSec}s.</span>
          </div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {language === 'en' ? 'Administrator Name' : 'የአስተዳዳሪ ስም'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={lockoutSec > 0}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {language === 'en' ? 'Passcode / Password' : 'የይለፍ ቃል'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={lockoutSec > 0}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={lockoutSec > 0 || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#14274E] hover:bg-[#0a1e36] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting 
                  ? (language === 'en' ? 'Verifying Access...' : 'በማረጋገጥ ላይ...') 
                  : (language === 'en' ? 'Authenticate & Enter' : 'አረጋግጥና ግባ')}
              </span>
            </button>
          </div>

        </form>

        {/* Security Warning Notice */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Authorized municipal personnel only. All access attempts and administrative modifications are monitored and logged.
          </p>
        </div>

      </motion.div>

    </div>
  );
};
