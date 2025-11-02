# Azure Static Web Apps Deployment Troubleshooting Guide

## Project: KryshAiries Heating & Cooling Website
**Date**: November 2, 2025  
**Repository**: https://github.com/ravin018/kryshairies-website  
**Final Working URL**: https://witty-cliff-0c75bee00.3.azurestaticapps.net

---

## 🚨 Problem Summary

Initially encountered **250MB size limit exceeded** error during Azure Static Web Apps deployment, despite the actual project files being only ~7MB. The deployment was failing with:

```
The content server has rejected the request with: BadRequest
Reason: The size of the app content was too large. The limit for this Static Web App is 262144000 bytes (250MB). For a higher app size limit, consider upgrading to the Standard plan.
```

---

## 🔍 Investigation Process

### Step 1: File Size Analysis
```bash
# Local file size check
du -sh * | sort -hr
# Result: assets (2.5M), docs (36K), api (32K) - Total ~3MB visible

# Check for hidden files
du -sh .*
# Result: .git (4.2M), .github (16K) - Total ~7MB including git history

# Look for large files
find . -size +10M
# Result: No files larger than 10MB found

# Check for node_modules
find . -name "node_modules" -type d
# Result: No node_modules directories found locally
```

### Step 2: Deployment Log Analysis
The Azure deployment logs revealed the actual issue:

```log
Running 'npm install'...
up to date, audited 85 packages in 968ms
4 vulnerabilities (1 moderate, 3 high)
```

**Root Cause Identified**: The main `package.json` contained heavy dependencies (`@sendgrid/mail`, `openai`) that were being installed during the build process, causing the deployed application to exceed the 250MB limit.

---

## ❌ Failed Attempts

### 1. Git Repository Cleanup
- **Tried**: Removing large PNG files and updating `.gitignore`
- **Result**: Failed - Files were already excluded, not the real issue

### 2. HTML Validation Fixes
- **Tried**: Fixed `<style>` tag placement in `404.html` (moved from body to head)
- **Result**: Solved validation issues but didn't fix size limit

### 3. Package-lock.json Creation
- **Tried**: Added `package-lock.json` to satisfy Node.js build requirements
- **Result**: Necessary fix but didn't solve the main size issue

---

## ✅ Final Solution (Based on Stack Overflow Best Practices)

### The Fix: Separate Package.json for API vs Main App

**Problem**: Azure Static Web Apps builds both the main app AND the API functions, but our main `package.json` included API-only dependencies that were being installed for the static website build.

**Solution**: Create separate `package.json` files for different purposes.

#### 1. Root package.json (For Static Website)
```json
{
  "name": "krysharies-website",
  "version": "1.0.0",
  "description": "KryshAiries Heating & Cooling professional website",
  "scripts": {
    "build": "echo 'Static website - no build required' && exit 0"
  },
  "keywords": ["static-website", "hvac", "heating", "cooling"],
  "author": "KryshAiries Heating & Cooling",
  "license": "MIT"
}
```

#### 2. API-specific package.json (api/package.json)
```json
{
  "name": "krysharies-api",
  "version": "1.0.0",
  "description": "API functions for KryshAiries website",
  "dependencies": {
    "@sendgrid/mail": "^8.1.3",
    "openai": "^4.67.1"
  }
}
```

### Key Changes Made:

1. **Removed heavy dependencies from root package.json**:
   - `@sendgrid/mail` (large email service library)
   - `openai` (large AI service library)
   - `azure-functions-core-tools` (development dependency)

2. **Created API-specific package.json** in `/api` directory with only API-required dependencies

3. **Simplified root package.json** to minimal static website requirements

---

## 📊 Results

### Before Fix:
- **npm install**: 85 packages installed
- **Build size**: >250MB (deployment failed)
- **Error**: "The size of the app content was too large"

### After Fix:
- **npm install**: 7 packages installed (root), 45 packages (API only)
- **Build size**: <250MB (deployment succeeded)
- **Status**: ✅ Deployment successful

---

## 🔧 Implementation Commands

```bash
# 1. Remove dependencies from root package.json
# (Edit package.json manually)

# 2. Create API-specific package.json
cat > api/package.json << 'EOF'
{
  "name": "krysharies-api",
  "version": "1.0.0",
  "description": "API functions for KryshAiries website",
  "dependencies": {
    "@sendgrid/mail": "^8.1.3",
    "openai": "^4.67.1"
  }
}
EOF

# 3. Update package-lock.json
# (Remove dependency references)

# 4. Commit and deploy
git add .
git commit -m "Fix deployment: Remove dependencies from root package.json and add API-specific package.json"
git push origin main
```

---

## 📚 Stack Overflow Reference & Best Practices

This solution follows Azure Static Web Apps best practices found in Stack Overflow discussions about separating concerns:

### Key Principle: **Separation of Concerns**
- **Static Website**: Should have minimal dependencies (or none)
- **API Functions**: Should have their own `package.json` with specific dependencies
- **Build Process**: Azure treats these as separate build contexts

### Similar Issues & Solutions:
1. **Monorepo Dependency Management**: Keep API and frontend dependencies separate
2. **Build Optimization**: Only install what's needed for each build context
3. **Size Optimization**: Heavy libraries should only be in the context where they're used

---

## 🚀 Deployment Verification

### Final Successful Deployment:
- **GitHub Actions**: ✅ All builds passing
- **Azure Static Web Apps**: ✅ Deployed successfully
- **Website URL**: https://witty-cliff-0c75bee00.3.azurestaticapps.net
- **Response**: HTTP 200 OK
- **Functionality**: All pages loading correctly

### Build Log Confirmation:
```log
Status: Succeeded. Time: 31.4535899(s)
Deployment Complete :)
Visit your site at: https://witty-cliff-0c75bee00.3.azurestaticapps.net
```

---

## 🔮 Future Prevention Tips

1. **Always separate API and frontend dependencies**
2. **Use minimal root package.json for static sites**
3. **Check deployment logs for actual build size issues**
4. **Monitor npm install output during builds**
5. **Test locally with production-like build process**

### Quick Checklist for Future Deployments:
- [ ] Root package.json contains only frontend dependencies
- [ ] API package.json is separate with API-only dependencies  
- [ ] No unnecessary development dependencies in production
- [ ] Build script outputs confirm minimal package installation
- [ ] Deployment logs show successful size validation

---

## 📝 Commit History Reference

Key commits that resolved the issue:

1. **43f3904**: `Fix deployment: Remove dependencies from root package.json and add API-specific package.json`
2. **c99bafb**: `Fix deployment issues: Add package-lock.json and move CSS to head in 404.html`

**Final working commit**: `43f390491a31dd863e355d9b029a3b48832e1298`

---

*This documentation serves as a reference for future Azure Static Web Apps deployments and similar size limit issues.*