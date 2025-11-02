# Custom Domain Setup: kryshairies.com.au

## ✅ **Completed: Code Updates**
All website references have been updated from `kryshvac.com.au` to `kryshairies.com.au`:

- ✅ **sitemap.xml** - Updated all URLs to kryshairies.com.au
- ✅ **robots.txt** - Updated sitemap reference
- ✅ **services.html** - Updated canonical URL, Open Graph URL, and email
- ✅ **about.html** - Updated canonical URL, Open Graph URL, and email  
- ✅ **404.html** - Updated email reference

## 🚀 **Next Steps: Azure Portal Configuration**

### 1. **Add Custom Domain in Azure Static Web Apps**

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to your Static Web App** (`witty-cliff-0c75bee00`)
3. **Go to "Custom domains"** (left sidebar)
4. **Click "+ Add"**
5. **Enter domain**: `kryshairies.com.au`
6. **Select**: "Custom domain on other DNS"
7. **Click "Next"**

### 2. **Configure DNS Records**

Azure will provide you with DNS records. Add these to your domain registrar:

#### **Required DNS Records:**
```
# CNAME Record (for www subdomain - optional)
Type: CNAME
Name: www
Value: witty-cliff-0c75bee00.3.azurestaticapps.net

# A Record (for root domain)
Type: A
Name: @
Value: [Azure will provide the IP address]

# TXT Record (for domain verification)
Type: TXT
Name: _dnsauth
Value: [Azure will provide the verification token]
```

### 3. **Domain Registrar Setup**
1. **Log in to your domain registrar** (where you purchased kryshairies.com.au)
2. **Go to DNS Management**
3. **Add the records provided by Azure**
4. **Wait for DNS propagation** (can take up to 48 hours)

### 4. **Verify Domain in Azure**
1. **Return to Azure Portal**
2. **Click "Validate"** to check DNS records
3. **Once validated, click "Add"**
4. **Enable HTTPS** (Azure will automatically provision SSL certificate)

## 🔍 **Testing After Setup**

### **DNS Propagation Check:**
```bash
# Test domain resolution
nslookup kryshairies.com.au

# Test website access
curl -I https://kryshairies.com.au
```

### **Expected Results:**
- ✅ https://kryshairies.com.au loads your website
- ✅ SSL certificate is active (green padlock)
- ✅ Automatic redirect from Azure URL to custom domain
- ✅ All pages accessible with new domain

## 📧 **Email Configuration (Optional)**

If you want to use email addresses like `info@kryshairies.com.au`:

1. **Contact your domain registrar** for email hosting options
2. **Or use a service like** Google Workspace, Microsoft 365, or other email providers
3. **Set up MX records** as provided by your email service

## 🎯 **Current Status**

- ✅ **Website Code**: Ready with kryshairies.com.au references
- ⏳ **DNS Setup**: Waiting for your domain registrar configuration
- ⏳ **Azure Custom Domain**: Waiting for DNS verification
- ⏳ **SSL Certificate**: Will be auto-provisioned by Azure

## 📱 **Contact**

Once the domain is active, all contact references will use:
- **Email**: info@kryshairies.com.au  
- **Website**: https://kryshairies.com.au

---

**Note**: The website will continue to work on the Azure URL until the custom domain is fully configured.