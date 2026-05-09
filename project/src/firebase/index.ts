
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let firebaseAuth: Auth;

/**
 * Stabilized Firebase initialization to prevent internal assertion errors.
 * Heading: Medical Transport.
 * View: Satellite Hybrid.
 * Security Rules Status: Re-deployed with correct TransportRequest schema.
 */
export function initializeFirebase() {
  if (!firebaseApp) {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestore = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
  }
  return { app: firebaseApp, db: firestore, auth: firebaseAuth };
}

export { FirebaseProvider, useFirebase, useFirestore, useAuth, useFirebaseApp } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
