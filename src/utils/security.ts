/**
 * Security utilities: input sanitization, URL protocol validation,
 * and session security.
 */

const ADMIN_SESSION_KEY = 'nsl_admin_session_auth';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 1 minute lockout

/**
 * Sanitize text input to prevent XSS and strip potentially malicious HTML/scripts.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[<>]/g, '') // strip < and >
    .trim();
}

/**
 * Validates that an external URL only uses legitimate http/https protocols.
 * Blocks dangerous schemes like javascript:, data:, vbscript:, etc.
 */
export function isSafeUrl(url?: string): boolean {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim().toLowerCase();
  
  // Must start with http:// or https://
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) {
    return false;
  }

  // Reject javascript:, data:, blob:, file:
  if (
    trimmed.includes('javascript:') ||
    trimmed.includes('data:') ||
    trimmed.includes('vbscript:') ||
    trimmed.includes('file:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Check if the admin is currently authenticated in this browser session.
 */
export function isAuthenticatedAdmin(): boolean {
  try {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    if (parsed.authenticated && parsed.expiresAt && Date.now() < parsed.expiresAt) {
      return true;
    }
    // Expired
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  } catch {
    return false;
  }
}

/**
 * Persist authenticated admin session for 4 hours.
 */
export function setAdminAuthenticatedSession(): void {
  try {
    const sessionData = {
      authenticated: true,
      user: 'admin',
      loginTime: Date.now(),
      expiresAt: Date.now() + 4 * 60 * 60 * 1000 // 4 hours
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.error('Failed to set admin session:', e);
  }
}

/**
 * Clear admin session on logout.
 */
export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear admin session:', e);
  }
}

/**
 * Brute-force rate limiting for admin login.
 */
export function checkLoginRateLimit(): { isLocked: boolean; remainingSec: number } {
  try {
    const stored = localStorage.getItem('nsl_admin_attempts');
    if (!stored) return { isLocked: false, remainingSec: 0 };
    const { count, lockUntil } = JSON.parse(stored);
    
    if (lockUntil && Date.now() < lockUntil) {
      const remainingSec = Math.ceil((lockUntil - Date.now()) / 1000);
      return { isLocked: true, remainingSec };
    }
    return { isLocked: false, remainingSec: 0 };
  } catch {
    return { isLocked: false, remainingSec: 0 };
  }
}

export function recordFailedLogin(): { isLocked: boolean; remainingSec: number } {
  try {
    const stored = localStorage.getItem('nsl_admin_attempts');
    let count = 1;
    if (stored) {
      const parsed = JSON.parse(stored);
      count = (parsed.count || 0) + 1;
    }

    if (count >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem('nsl_admin_attempts', JSON.stringify({ count, lockUntil }));
      return { isLocked: true, remainingSec: 60 };
    }

    localStorage.setItem('nsl_admin_attempts', JSON.stringify({ count, lockUntil: 0 }));
    return { isLocked: false, remainingSec: 0 };
  } catch {
    return { isLocked: false, remainingSec: 0 };
  }
}

export function resetLoginAttempts(): void {
  try {
    localStorage.removeItem('nsl_admin_attempts');
  } catch {
    // ignore
  }
}
