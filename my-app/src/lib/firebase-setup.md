# Firebase Setup Guide for Probabl

## Option 1: Firebase (Recommended)

### Steps:
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Firestore Database
4. Get your config keys
5. Install: `npm install firebase`

### Benefits:
- Free tier is generous
- Real-time updates
- Easy authentication
- Works great with Next.js

## Option 2: Use Next.js API Routes (Simpler)

Create API endpoints in your app:
- `/api/challenges` - Store challenge data
- `/api/leaderboard` - Global leaderboard
- `/api/social` - Social features

This keeps everything in one app!

## Option 3: Keep localStorage + Add Sharing

Instead of a full backend, enhance localStorage with:
- Share links that encode game state
- QR codes for mobile sharing
- Export/import game data as JSON 