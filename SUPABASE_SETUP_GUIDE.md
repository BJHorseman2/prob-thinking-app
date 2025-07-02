# 🚀 Supabase Production Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill out:
   - **Organization**: Create new or use existing
   - **Name**: `probabl-production`  
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (US East for US traffic)
   - **Pricing Plan**: Free tier is perfect for soft launch

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the ENTIRE contents of `supabase-schema.sql` file
4. Paste into the SQL editor
5. Click "Run" (this creates all tables, policies, and triggers)
6. You should see: "Success. No rows returned"

## Step 3: Get Your API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **Anon public key**: `eyJ...` (long string starting with eyJ)

## Step 4: Configure Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com) → Your probabl project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

### Required:
```
NEXT_PUBLIC_SUPABASE_URL = https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ[your-anon-key]
NEXT_PUBLIC_SITE_URL = https://probabl.xyz
NEXT_PUBLIC_ENVIRONMENT = production
```

### Optional (for later):
```
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN = [your-token]
```

4. Click "Save" for each variable
5. **Deploy** → This will trigger a new deployment with your database

## Step 5: Test Database Connection

1. Wait for Vercel deployment to complete
2. Visit https://probabl.xyz
3. Try to register a new account
4. Complete a challenge
5. Check if your score persists after refresh
6. Verify leaderboard updates

## Troubleshooting

### If registration fails:
- Check Supabase logs: **Logs** → **Auth**
- Verify RLS policies are enabled
- Check if user_profiles trigger is working

### If data doesn't persist:
- Check Supabase logs: **Logs** → **Database**
- Verify environment variables in Vercel
- Check browser console for errors

### If still using localStorage:
- App shows "Supabase not configured" in console
- Double-check environment variable names (exact spelling)
- Redeploy after adding env vars

## Success Indicators ✅

- [ ] Can register new users
- [ ] Challenges complete and save to database  
- [ ] Leaderboard shows real user data
- [ ] Badges persist across sessions
- [ ] No "Supabase not configured" messages

## Next Steps

Once database is working:
1. Set up Google Analytics
2. Create social sharing images
3. Test on mobile devices
4. Recruit 5-10 beta testers!