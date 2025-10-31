# Deployment Guide - Krysh HVAC Website

This comprehensive guide walks you through deploying the Krysh HVAC website to Azure Static Web Apps with custom domain setup.

## Prerequisites

Before starting deployment, ensure you have:

- [x] Azure account with active subscription
- [x] GitHub account with the repository
- [x] SendGrid account (for contact form emails)
- [x] Domain registrar access (for kryshvac.com.au)
- [x] Local development environment set up

## Phase 1: Azure Static Web Apps Setup

### Step 1: Create Azure Static Web App

1. **Login to Azure Portal**
   - Navigate to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create New Resource**
   ```
   Home → Create a resource → Web → Static Web App
   ```

3. **Basic Configuration**
   ```
   Subscription: Your subscription
   Resource Group: Create new "rg-kryshvac-prod"
   Name: "kryshvac-webapp"
   Plan type: Free (for development) or Standard (for production)
   Region: Australia East (closest to Melbourne)
   ```

4. **GitHub Integration**
   ```
   Source: GitHub
   Organization: Your GitHub username
   Repository: kryshvac-site
   Branch: main
   ```

5. **Build Configuration**
   ```
   Build Presets: Custom
   App location: /
   Api location: api
   Output location: /
   ```

6. **Review and Create**
   - Verify all settings
   - Click "Create"
   - Wait for deployment to complete (~2-3 minutes)

### Step 2: Retrieve Deployment Token

1. **Navigate to Your Static Web App**
   ```
   Resource Groups → rg-kryshvac-prod → kryshvac-webapp
   ```

2. **Get Deployment Token**
   ```
   Settings → Configuration → Manage deployment token
   Copy the token (save securely)
   ```

3. **Add to GitHub Secrets**
   ```
   GitHub Repository → Settings → Secrets and variables → Actions
   New repository secret:
   Name: AZURE_STATIC_WEB_APPS_API_TOKEN
   Value: [paste the deployment token]
   ```

## Phase 2: Environment Variables Setup

### Step 3: Configure SendGrid

1. **Create SendGrid Account**
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Verify your account and email

2. **Generate API Key**
   ```
   SendGrid Dashboard → Settings → API Keys
   Create API Key → Full Access
   Copy the API key (you won't see it again)
   ```

3. **Configure Sender Authentication**
   ```
   SendGrid Dashboard → Settings → Sender Authentication
   Authenticate Your Domain: kryshvac.com.au
   Or use Single Sender Verification: noreply@kryshvac.com.au
   ```

### Step 4: Set Azure Environment Variables

1. **Navigate to Static Web App Configuration**
   ```
   Azure Portal → kryshvac-webapp → Settings → Configuration
   ```

2. **Add Application Settings**
   ```
   Name: SENDGRID_API_KEY
   Value: [your SendGrid API key]
   
   Name: TO_EMAIL
   Value: info@kryshvac.com.au
   
   Name: FROM_EMAIL
   Value: noreply@kryshvac.com.au
   ```

3. **Save Configuration**
   - Click "Save" at the top
   - Wait for restart to complete

## Phase 3: Custom Domain Configuration

### Step 5: DNS Configuration

1. **Access Your Domain Registrar**
   - Login to your domain registrar (e.g., GoDaddy, Namecheap)
   - Navigate to DNS management for kryshvac.com.au

2. **Add CNAME Records**
   ```
   Type: CNAME
   Name: @
   Value: [your-static-web-app-name].azurestaticapps.net
   TTL: 3600 (or default)
   
   Type: CNAME  
   Name: www
   Value: [your-static-web-app-name].azurestaticapps.net
   TTL: 3600 (or default)
   ```

   **Example for Namecheap:**
   ```
   Host: @
   Value: kryshvac-webapp.azurestaticapps.net
   
   Host: www
   Value: kryshvac-webapp.azurestaticapps.net
   ```

3. **Wait for DNS Propagation**
   - DNS changes can take 24-48 hours to propagate globally
   - Test with: `nslookup kryshvac.com.au`

### Step 6: Configure Custom Domain in Azure

1. **Add Custom Domain**
   ```
   Azure Portal → kryshvac-webapp → Settings → Custom domains
   Click "+ Add"
   Custom domain name: kryshvac.com.au
   Domain validation: DNS TXT record (recommended)
   ```

2. **Verify Domain Ownership**
   - Azure will provide a TXT record
   - Add this TXT record to your DNS settings
   - Click "Validate" in Azure

3. **Enable HTTPS**
   - Once domain is verified, HTTPS is automatically enabled
   - Azure provides free SSL certificate
   - Certificate auto-renews

## Phase 4: Deployment Verification

### Step 7: Test Deployment

1. **Check Website Functionality**
   ```
   ✅ https://kryshvac.com.au loads correctly
   ✅ All pages accessible (services, about, gallery, etc.)
   ✅ Navigation works on mobile and desktop
   ✅ Images and styles load properly
   ```

2. **Test Contact Form**
   ```bash
   # Test form submission
   curl -X POST https://kryshvac.com.au/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com", 
       "phone": "0412345678",
       "suburb": "Melbourne",
       "message": "Test message from deployment"
     }'
   ```

3. **Verify Email Delivery**
   - Submit test form via website
   - Check if email arrives at TO_EMAIL address
   - Verify auto-reply email is sent

### Step 8: Performance Testing

1. **Lighthouse Audit**
   ```
   Open Chrome DevTools → Lighthouse tab
   Run audit for https://kryshvac.com.au
   Target scores: 90+ in all categories
   ```

2. **Core Web Vitals**
   ```
   Test with: https://pagespeed.web.dev/
   Enter: https://kryshvac.com.au
   Verify good Core Web Vitals scores
   ```

3. **Mobile Responsiveness**
   ```
   Test with: https://search.google.com/test/mobile-friendly
   Enter: https://kryshvac.com.au
   Ensure mobile-friendly result
   ```

## Phase 5: Monitoring and Maintenance

### Step 9: Set Up Monitoring

1. **Enable Application Insights**
   ```
   Azure Portal → kryshvac-webapp → Settings → Application Insights
   Enable Application Insights
   Create new or use existing workspace
   ```

2. **Configure Alerts**
   ```
   Application Insights → Alerts → New alert rule
   Set up alerts for:
   - Website downtime
   - High response times
   - API failures
   ```

### Step 10: SEO and Analytics

1. **Submit to Search Engines**
   ```
   Google Search Console:
   - Add property: https://kryshvac.com.au
   - Verify ownership via DNS TXT record
   - Submit sitemap: https://kryshvac.com.au/sitemap.xml
   
   Bing Webmaster Tools:
   - Add site: https://kryshvac.com.au
   - Verify ownership
   - Submit sitemap
   ```

2. **Set Up Analytics**
   ```
   Google Analytics 4:
   - Create new property for kryshvac.com.au
   - Add tracking code to all pages
   - Configure goals and conversions
   
   Or Plausible (privacy-friendly alternative):
   - Add script to all pages
   - Configure dashboard
   ```

## Troubleshooting Common Issues

### Domain Not Resolving

**Issue**: kryshvac.com.au doesn't load
**Solutions**:
```bash
# Check DNS propagation
dig kryshvac.com.au
nslookup kryshvac.com.au

# Verify CNAME records are correct
# Wait 24-48 hours for full propagation
# Clear browser cache and DNS cache
```

### SSL Certificate Issues

**Issue**: HTTPS not working or certificate errors
**Solutions**:
- Ensure domain is verified in Azure
- Wait for automatic certificate provisioning (can take up to 1 hour)
- Check that CNAME points to Azure Static Web App

### Contact Form Not Sending Emails

**Issue**: Form submits but no emails received
**Solutions**:
```bash
# Check Azure Function logs
Azure Portal → kryshvac-webapp → Functions → contact → Monitor

# Verify environment variables
Azure Portal → kryshvac-webapp → Configuration
Ensure SENDGRID_API_KEY and TO_EMAIL are set correctly

# Test SendGrid API key
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Build Failures

**Issue**: GitHub Actions deployment failing
**Solutions**:
```bash
# Check GitHub Actions logs
Repository → Actions → View failed workflow

# Common fixes:
# - Verify package.json syntax
# - Check HTML validation errors
# - Ensure all files are committed
# - Verify deployment token is correct
```

## Backup and Recovery

### Configuration Backup

1. **Export Azure Resources**
   ```bash
   # Export ARM template
   Azure Portal → kryshvac-webapp → Export template
   Download template for backup
   ```

2. **Document Settings**
   ```
   Environment Variables:
   - SENDGRID_API_KEY: [documented securely]
   - TO_EMAIL: info@kryshvac.com.au
   - FROM_EMAIL: noreply@kryshvac.com.au
   
   DNS Records:
   - CNAME @ → kryshvac-webapp.azurestaticapps.net
   - CNAME www → kryshvac-webapp.azurestaticapps.net
   - TXT verification record
   ```

### Disaster Recovery

1. **Repository Backup**
   - GitHub automatically backs up your code
   - Consider additional backup to different service

2. **Redeploy Process**
   ```bash
   # If complete rebuild needed:
   1. Create new Azure Static Web App
   2. Configure environment variables
   3. Set up custom domain
   4. Update GitHub repository secrets
   5. Deploy via GitHub Actions
   ```

## Post-Deployment Checklist

- [ ] Website loads at https://kryshvac.com.au
- [ ] All pages accessible and styled correctly
- [ ] Mobile responsiveness verified
- [ ] Contact form sends and receives emails
- [ ] SendGrid sender authentication configured
- [ ] DNS records properly configured
- [ ] SSL certificate active and valid
- [ ] Google Search Console verification complete
- [ ] Analytics tracking implemented
- [ ] Application Insights monitoring enabled
- [ ] Performance scores meet targets (90+ Lighthouse)
- [ ] Accessibility compliance verified
- [ ] SEO meta tags and schema.org markup active

## Maintenance Schedule

### Daily
- [ ] Monitor Application Insights for errors
- [ ] Check contact form submissions

### Weekly  
- [ ] Review analytics data
- [ ] Check website performance
- [ ] Monitor uptime status

### Monthly
- [ ] Update dependencies (`npm audit`)
- [ ] Review and update content
- [ ] Check broken links
- [ ] Verify SSL certificate status

### Quarterly
- [ ] Run full Lighthouse audit
- [ ] Review and optimize Core Web Vitals
- [ ] Update service offerings and pricing
- [ ] Backup configuration settings

---

**Need Help?**
- Azure Support: For hosting and infrastructure issues
- SendGrid Support: For email delivery problems  
- GitHub Support: For repository and Actions issues
- Contact: dev@kryshvac.com.au for website-specific questions
