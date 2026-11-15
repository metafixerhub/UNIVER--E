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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyUNIVERE2026ProductionKey',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'univer-e.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'univer-e',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'univer-e.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '107977837640',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:107977837640:web:univer_e_prod_app',
};

// Initialize Firebase App for SSR & Client
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Google 1-Click Sign-In
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.warn('[Firebase Google Auth]:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Recaptcha verifier for phone OTP SMS
 */
export function setUpRecaptcha(elementId: string) {
  if (typeof window === 'undefined') return null;
  try {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase reCAPTCHA] Solved');
      },
    });
  } catch (e) {
    console.warn('[Firebase reCAPTCHA] Initialized:', e);
    return null;
  }
}

/**
 * Send Phone OTP via Firebase
 */
export async function sendPhoneOtp(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true, confirmationResult };
  } catch (error: any) {
    console.warn('[Firebase Phone Auth]:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Browser verification capability helper
 */
export function getBrowserAuthCapabilities() {
  if (typeof window === 'undefined') {
    return { hasLocalStorage: false, hasCrypto: false, userAgent: 'SSR' };
  }
  return {
    hasLocalStorage: typeof window.localStorage !== 'undefined',
    hasCrypto: typeof window.crypto !== 'undefined',
    userAgent: window.navigator.userAgent,
    isSecureContext: window.isSecureContext,
  };
}

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
};
