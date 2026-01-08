import admin from "firebase-admin";

function loadServiceAccountFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing");

  try {
    return JSON.parse(raw);
  } catch {
    // Common case: JSON pasted with escaped newlines in private_key
    const fixed = raw.replace(/\\n/g, "\n");
    return JSON.parse(fixed);
  }
}

export function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin;

  const serviceAccount = loadServiceAccountFromEnv();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  return admin;
}
