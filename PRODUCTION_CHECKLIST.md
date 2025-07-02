# 🚀 Probabl.xyz Production Deployment Checklist

## ✅ Database Setup (HIGH PRIORITY)

### 1. Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com) and create new project
- [ ] Choose region closest to your users (US East for US traffic)
- [ ] Copy your project URL and anon key

### 2. Run Database Schema
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Copy and paste the entire `supabase-schema.sql` file
- [ ] Run the schema to create all tables, policies, and triggers

### 3. Configure Vercel Environment Variables
Go to Vercel Dashboard → probabl-xyz → Settings → Environment Variables:

**Required:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://[your-project-ref].supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[your-anon-key]`

**Recommended:**
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://probabl.xyz`
- [ ] `NEXT_PUBLIC_ENVIRONMENT` = `production`

### 4. Test Database Connection
- [ ] Deploy to Vercel with new env vars
- [ ] Test user registration/login
- [ ] Verify leaderboard updates
- [ ] Test challenge completion persistence

---

## ✅ SEO & Social (HIGH PRIORITY)

### Meta Tags & Open Graph
- [ ] Add proper meta descriptions
- [ ] Create Open Graph images for social sharing
- [ ] Add structured data for search engines

### Social Sharing
- [ ] Test Facebook/Twitter link previews
- [ ] Create branded share images
- [ ] Add social media links

---

## ✅ Analytics & Monitoring (HIGH PRIORITY)

### Analytics Setup
Choose one:
- [ ] **Google Analytics 4** (free, comprehensive)
- [ ] **Mixpanel** (better for app events)
- [ ] **Posthog** (privacy-focused, self-hosted option)

### Error Monitoring
- [ ] **Sentry** for error tracking
- [ ] **LogRocket** for user session recording (optional)

### Key Metrics to Track:
- [ ] User registrations
- [ ] Challenge completions  
- [ ] Badge earnings
- [ ] Weekly retention
- [ ] Bounce rate

---

## ✅ Legal & Compliance (HIGH PRIORITY)

### Required Pages
- [ ] **Privacy Policy** (especially important with user data)
- [ ] **Terms of Service**
- [ ] **Cookie Policy** (if using analytics)

### GDPR/CCPA Compliance
- [ ] Cookie consent banner
- [ ] Data deletion mechanism
- [ ] Privacy controls in user settings

---

## ✅ Performance & UX (MEDIUM PRIORITY)

### Performance Optimization
- [ ] Enable Next.js Image Optimization
- [ ] Add loading states for all async operations
- [ ] Implement error boundaries
- [ ] Test mobile performance

### User Experience
- [ ] Add user feedback mechanism
- [ ] Create help/tutorial section
- [ ] Add contact/support email
- [ ] Test across different browsers

---

## ✅ Security & Backup (MEDIUM PRIORITY)

### Security
- [ ] Verify Supabase RLS policies are working
- [ ] Test authentication edge cases
- [ ] Secure environment variables

### Backup Strategy
- [ ] Enable Supabase automated backups
- [ ] Document data recovery procedures
- [ ] Test backup restoration

---

## 🎯 Launch Strategy

### Soft Launch
- [ ] Deploy to production
- [ ] Test with 5-10 beta users
- [ ] Monitor for 48 hours
- [ ] Fix any critical issues

### Marketing Launch
- [ ] Social media announcement
- [ ] Product Hunt submission
- [ ] Behavioral economics communities
- [ ] Content marketing (blog posts)

---

## 📊 Success Metrics (Week 1)
- [ ] 100+ unique visitors
- [ ] 20+ user registrations  
- [ ] 50+ challenges completed
- [ ] <5% error rate
- [ ] >80% mobile usability score

---

## 🔧 Quick Commands

```bash
# Deploy to production
npm run build
vercel --prod

# Check production logs
vercel logs

# Test database connection
npm run test:db
```