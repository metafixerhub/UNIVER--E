import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';

/**
 * Firebase Client SDK Configuration for UNIVER-E
 * Keys can be configured in .env.local or Vercel Environment Variables
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKeyUNIVERE2026FirebasePlaceholder',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'univer-e-prod.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'univer-e-prod',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'univer-e-prod.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '104829103948',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:104829103948:web:7a8b9c0d1e2f3g4h5i6j',
};

// Initialize Firebase safely (avoid re-initialization during Next.js hot reload)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

/**
 * Setup Recaptcha Verifier for Phone OTP
 */
export function setupRecaptcha(elementId: string) {
  if (typeof window === 'undefined') return null;

  try {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase Recaptcha] Verified');
      },
    });
  } catch (err) {
    console.warn('[Firebase Recaptcha Warning]', err);
    return null;
  }
}

/**
 * Send Phone OTP via Firebase
 */
export async function sendOtpToPhone(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

/**
 * Check Browser compatibility for Web Authentication and Recaptcha
 */
export function getBrowserAuthCapabilities() {
  if (typeof window === 'undefined') return { supported: true, name: 'Server' };

  const ua = navigator.userAgent;
  let browser = 'Unknown';

  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';
  else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  return {
    browser,
    hasLocalStorage: typeof window.localStorage !== 'undefined',
    hasSessionStorage: typeof window.sessionStorage !== 'undefined',
    hasCrypto: typeof window.crypto !== 'undefined',
    hasServiceWorker: 'serviceWorker' in navigator,
  };
}
