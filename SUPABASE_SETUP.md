# Supabase Setup Guide for Probabl

## Quick Setup

1. **Go to your Supabase Dashboard**
   - Navigate to your project at https://app.supabase.com

2. **Run the Database Schema**
   - Go to SQL Editor (left sidebar)
   - Click "New Query"
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" 

3. **Enable Authentication**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - For social logins, enable:
     - Google (requires Google Cloud Console setup)
     - GitHub (requires GitHub OAuth App)
   - Add your redirect URLs: `http://localhost:3001` and your production URL

4. **Enable Realtime (for live leaderboard)**
   - Go to Database → Replication
   - Enable replication for `user_profiles` table
   - This powers the live leaderboard updates

5. **Your app is now connected!**
   - The app will automatically detect Supabase is configured
   - Users can sign up/sign in
   - All data will sync across devices

## Features with Supabase

When Supabase is connected, you get:
- ✅ User accounts and authentication
- ✅ Social login with Google & GitHub
- ✅ Data syncs across all devices
- ✅ **Real-time leaderboard** - See updates instantly
- ✅ Persistent progress and badges
- ✅ Profile customization (username)
- ✅ Secure data storage with Row Level Security

## Fallback Mode

If Supabase is not configured or offline:
- 📱 App still works with localStorage
- 🔒 Data is saved locally on device
- ⚡ No account needed
- ❌ No cross-device sync

## Testing

1. Click "Sign In" button in the app
2. Create a new account
3. Your progress will now sync!

## Troubleshooting

**"Module not found" errors in terminal**
- These are from old cached builds
- The app is working correctly
- Run `rm -rf .next && npm run dev` to clear cache

**Auth not working**
- Check your .env.local has correct values
- Ensure both URL and ANON_KEY start with `NEXT_PUBLIC_`
- Restart the dev server after changing .env.local

**Database errors**
- Make sure you ran the schema SQL
- Check Row Level Security is enabled
- Verify your user has proper permissions 