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
  ShieldAlert,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  setAdminAuthenticatedSession,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  sanitizeText,
  verifyAdminCredentials
} from '../utils/security';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const { language, toggleLanguage } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSec, setLockoutSec] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const { isLocked, remainingSec } = checkLoginRateLimit();
    if (isLocked) {
      setErrorMessage(
        language === 'en'
          ? `Too many failed attempts. Try again in ${remainingSec}s.`
          : `በተደጋጋሚ ስህተት ምክንያት ተቆልፏል። ከ ${remainingSec} ሰከንድ በኋላ ይሞክሩ።`
      );
      return;
    }

    const cleanUser = sanitizeText(username);
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage(
        language === 'en' ? 'Username and password are required.' : 'የተጠቃሚ ስም እና የይለፍ ቃል ያስፈልጋል።'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (verifyAdminCredentials(cleanUser, cleanPass)) {
        resetLoginAttempts();
        setAdminAuthenticatedSession();
        onLoginSuccess();
      } else {
        const { isLocked: nowLocked, remainingSec: retrySec } = recordFailedLogin();
        if (nowLocked) {
          setLockoutSec(retrySec);
          setErrorMessage(
            language === 'en'
              ? `Access denied. Account locked after 5 failed attempts. Try again in ${retrySec}s.`
              : `መግቢያ ተከልክሏል። ከ 5 ሙከራ በኋላ ተቆልፏል። ከ ${retrySec} ሰከንድ በኋላ ይሞክሩ።`
          );
        } else {
          setErrorMessage(
            language === 'en'
              ? 'Invalid staff credentials.'
              : 'የተሳሳተ የአስተዳዳሪ መረጃ።'
          );
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#0f172a] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0348AB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Back to Public Portal' : 'ወደ ዋናው ፖርታል ተመለስ'}</span>
        </button>
        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-xs font-semibold text-[#0a1e36] cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#0348AB]" />
          <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#14274E]" />

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#14274E] text-white flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#14274E] tracking-tight">
              {language === 'en' ? 'Staff Auction Desk' : 'የጨረታ አስተዳደር መግቢያ'}
            </h2>
            <p className="text-xs text-[#6B6558] mt-1">
              {language === 'en'
                ? 'Nifas Silk-Lafto Sub-City — authorized personnel only'
                : 'ንፋስ ስልክ ላፍቶ ክፍለ ከተማ — ለተፈቀደላቸው ባለሥልጣናት ብቻ'}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-[#0348AB] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>{language === 'en' ? 'Restricted staff session' : 'የተጠበቀ የሰራተኛ መግቢያ'}</span>
          </div>
        </div>

        {lockoutSec > 0 && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {language === 'en'
                ? `Security lockout active. Retry in ${lockoutSec}s.`
                : `መቆለፊያ ንቁ ነው። ከ ${lockoutSec} ሰከንድ በኋላ ይሞክሩ።`}
            </span>
          </div>
        )}

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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {language === 'en' ? 'Staff username' : 'የአስተዳዳሪ ስም'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === 'en' ? 'Enter username' : 'የተጠቃሚ ስም ያስገቡ'}
                disabled={lockoutSec > 0}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {language === 'en' ? 'Password' : 'የይለፍ ቃል'}
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={lockoutSec > 0 || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#14274E] hover:bg-[#0a1e36] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (language === 'en' ? 'Verifying…' : 'በማረጋገጥ ላይ...')
                  : (language === 'en' ? 'Sign in' : 'ግባ')}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'Municipal staff only. Failed attempts are rate-limited in this browser.'
              : 'ለማዘጋጃ ቤት ሰራተኞች ብቻ። ያልተሳኩ ሙከራዎች በዚህ አሳሽ ይገደባሉ።'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
