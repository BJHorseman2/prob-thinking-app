# Domain Setup Guide for probabl.xyz

## Quick Checklist

### 1. At Your Domain Registrar
Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

### 2. In Vercel Dashboard
1. Go to your project settings
2. Navigate to "Domains"
3. Ensure both domains are added:
   - `probabl.xyz`
   - `www.probabl.xyz`
4. Set `www.probabl.xyz` as primary (recommended)

### 3. Common Domain Registrars

**Namecheap:**
- Advanced DNS → Add New Record

**GoDaddy:**
- DNS → Records → Add

**Google Domains:**
- DNS → Custom records → Add

**Cloudflare:**
- DNS → Add record (set proxy to OFF/DNS only)

### 4. Verification Steps
After adding DNS records:
1. Wait 5-30 minutes for DNS propagation
2. Check status: `nslookup probabl.xyz`
3. Refresh Vercel domains page
4. Both domains should show green checkmarks

### 5. Troubleshooting

**Still showing "Invalid Configuration"?**
- Ensure no conflicting A/AAAA records exist
- Remove any wildcard (*) records
- Check if using Cloudflare proxy (should be OFF)
- Verify nameservers point to registrar's defaults

**SSL Certificate Issues?**
- Vercel automatically provisions SSL
- May take up to 24 hours after domain verification

## Test Your Domain
Once configured, your app will be accessible at:
- https://probabl.xyz
- https://www.probabl.xyz 