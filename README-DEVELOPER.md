# Probabl - Behavioral Economics Gaming Platform

## Developer Onboarding Guide

### Project Overview
Probabl is a behavioral economics education platform that gamifies learning about cognitive biases through interactive challenges.

### Current Status
- **Development**: Fully functional on localhost:3001
- **Production Issue**: Content mismatch between local and deployed versions
- **Repository**: https://github.com/BJHorseman2/prob-thinking-app

### Quick Start
```bash
git clone https://github.com/BJHorseman2/prob-thinking-app.git
cd prob-thinking-app/my-app
npm install
npm run dev
```

Access the app at http://localhost:3001

### Main Issue to Debug
**Content Size Difference:**
- Localhost: ~25,257 characters
- Production: ~19,231 characters  
- Missing: ~6,000 characters of content

### Tech Stack
- Next.js 15.3.3
- React 19 
- TypeScript
- Tailwind CSS
- Supabase
- Framer Motion
- Vercel deployment

### Key Files
- `/src/app/page.tsx` - Main application (1,939 lines)
- `/src/components/` - All React components
- `/src/lib/` - Utilities and data
- `STABLE-VERSION.md` - Recovery documentation

### Testing the Issue
1. Run `npm run dev` and check localhost:3001
2. Compare with https://www.probabl.xyz
3. Content should match exactly

### Stable Version
Use tag `v1.0-stable-working` as the baseline working version.

### Contact
Available for immediate collaboration and screen sharing sessions.