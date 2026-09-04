import "server-only";

import {
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const app =
  getApps()[0] ??
  initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

export const db = getFirestore(app);
export const bucket = getStorage(app).bucket();
