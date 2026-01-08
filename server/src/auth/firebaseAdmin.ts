import admin from "firebase-admin";
import fs from "node:fs";

function loadServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json && json.trim()) {
    return JSON.parse(json);
  }

  const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (p && p.trim()) {
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw);
  }

  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON (or FIREBASE_SERVICE_ACCOUNT_PATH for local dev)");
}

export function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin;

  const serviceAccount = loadServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  return admin;
}
