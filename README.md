# MangaX (Vite + React)

This project is a Vite + React app for the MangaX prototype.

## Setup

1) Install deps  
```bash
npm install
```

2) Env vars  
Copy `.env.example` to `.env` and fill with your Firebase project values. On Vercel, add the same keys in Project Settings → Environment Variables (Production/Preview):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_APP_ID`

3) Run dev server  
```bash
npm run dev
```

## Firebase security rules

Included baseline rules:
- `firestore.rules`: public reads; writes require auth with basic ownership checks (series.createdBy, requests.userId, profile owner). Deletes are mostly disabled.
- `storage.rules`: public reads under `/public`, writes require auth; `/users/{userId}` is owner-only.

Deploy rules (adjust to your policy first):
```bash
firebase deploy --only firestore:rules,storage:rules
```

> Note: tighten rules further once you move critical writes to server-side (Cloud Functions / backend). Avoid keeping client-only writes for payments/sensitive operations.

## Build & Deploy

Vercel detects Vite automatically. Build command `npm run build`, output `dist`.  
Large bundle warning can be silenced by bumping `build.chunkSizeWarningLimit` in `vite.config.js` or by code-splitting.
