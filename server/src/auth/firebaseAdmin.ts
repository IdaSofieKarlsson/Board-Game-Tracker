import admin from "firebase-admin";
import fs from "node:fs";

function loadServiceAccount() {
  const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!p) throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH is missing");

  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

export function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin;

  const serviceAccount = loadServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  return admin;
}
