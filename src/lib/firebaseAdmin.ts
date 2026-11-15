import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

/**
 * UNIVER-E Firebase Admin SDK Server-side Initialization
 * 
 * Used in Next.js Server Components, Server Actions & API Routes to:
 * - Verify user authentication tokens
 * - Manage user accounts & set custom claims (student, instructor, admin)
 * - Safely sync profiles with MongoDB Atlas
 */

interface AdminCredentials {
  projectId?: string;
  project_id?: string;
  clientEmail?: string;
  client_email?: string;
  privateKey?: string;
  private_key?: string;
}

function getFirebaseAdminCredentials(): AdminCredentials {
  // 1. Try local service account file if present in workspace (development)
  const localKeyPath = path.join(process.cwd(), 'univer-e-firebase-adminsdk-fbsvc-ff19c6f5cf.json');
  if (fs.existsSync(localKeyPath)) {
    try {
      const fileData = fs.readFileSync(localKeyPath, 'utf8');
      return JSON.parse(fileData);
    } catch (e) {
      console.warn('[Firebase Admin] Error reading local key file:', e);
    }
  }

  // 2. Otherwise read from environment variables (recommended for Vercel production)
  return {
    projectId: process.env.FIREBASE_PROJECT_ID || 'univer-e',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@univer-e.iam.gserviceaccount.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
  };
}

let adminApp: App | undefined;
let adminAuth: Auth | undefined;

const credentials = getFirebaseAdminCredentials();
const apps = getApps();

if (!apps.length) {
  try {
    const privateKey = credentials.privateKey || credentials.private_key;
    const clientEmail = credentials.clientEmail || credentials.client_email;
    const projectId = credentials.projectId || credentials.project_id || 'univer-e';

    if (privateKey && clientEmail) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log('[Firebase Admin] Initialized successfully with Service Account');
    } else {
      adminApp = initializeApp({
        projectId: 'univer-e',
      });
      console.log('[Firebase Admin] Initialized with Project ID: univer-e');
    }
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error);
  }
} else {
  adminApp = apps[0];
}

if (adminApp) {
  try {
    adminAuth = getAuth(adminApp);
  } catch (e) {
    console.warn('[Firebase Admin] Could not initialize getAuth:', e);
  }
}

export { adminApp, adminAuth };
export default adminApp;
