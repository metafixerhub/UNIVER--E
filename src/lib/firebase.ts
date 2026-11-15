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
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

/**
 * Firebase Client SDK Configuration for UNIVER-E
 * Project ID: univer-e
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKeyUNIVERE2026FirebasePlaceholder',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'univer-e.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'univer-e',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'univer-e.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '107977837640',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:107977837640:web:univer_e_prod_app',
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * 1-Click Google Sign-In
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    console.error('[Firebase Google Auth Error]', error);
    return {
      success: false,
      error: error.message || 'Google authentication failed',
    };
  }
}

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
  let browser = 'Google Chrome';

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
