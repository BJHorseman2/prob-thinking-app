#!/bin/bash

echo "🔍 Checking DNS configuration for probabl.xyz..."
echo ""

echo "Root domain (probabl.xyz):"
nslookup probabl.xyz
echo ""

echo "WWW subdomain (www.probabl.xyz):"
nslookup www.probabl.xyz
echo ""

echo "✅ Expected results:"
echo "- probabl.xyz should resolve to: 76.76.21.21"
echo "- www.probabl.xyz should be CNAME to: cname.vercel-dns.com"
echo ""

echo "📝 Current Vercel deployment:"
echo "- Project: prob-thinking-app"
echo "- URL: https://prob-thinking-app.vercel.app" 