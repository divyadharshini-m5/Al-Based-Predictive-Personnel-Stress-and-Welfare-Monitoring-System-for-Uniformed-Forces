/**
 * Firebase wiring (INACTIVE until real config is supplied).
 *
 * Add these to your .env to switch off DEMO_MODE:
 *   VITE_FIREBASE_API_KEY=
 *   VITE_FIREBASE_AUTH_DOMAIN=
 *   VITE_FIREBASE_PROJECT_ID=
 *   VITE_FIREBASE_APP_ID=
 *   VITE_DEMO_MODE=false
 *
 * Then: `bun add firebase` and uncomment the initialisation block below.
 * Firestore layout (shared with the Sahayak Command web dashboard):
 *   users/{userId}                        -> name, serviceId, role
 *   checkins/{userId}/entries/{entryId}   -> date, mood, sleepHours, workload, journalText
 *   supportRequests/{requestId}           -> userId | "anonymous", timestamp, status
 */

export const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] ?? "",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] ?? "",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] ?? "",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] ?? "",
};

/** True when no real Firebase project is configured — everything runs locally. */
export const DEMO_MODE =
  import.meta.env["VITE_DEMO_MODE"] === "true" || !firebaseConfig.projectId;

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// export const app = DEMO_MODE ? null : initializeApp(firebaseConfig);
// export const auth = app ? getAuth(app) : null;
// export const db = app ? getFirestore(app) : null;
