# Custom Domain Setup: kryshairies.com.au (Root Domain Only)

## ✅ **Completed: Code Updates**
All website references have been updated to use `kryshairies.com.au` (root domain only):

- ✅ **sitemap.xml** - Updated all URLs to kryshairies.com.au
- ✅ **robots.txt** - Updated sitemap reference
- ✅ **services.html** - Updated canonical URL, Open Graph URL, and email
- ✅ **about.html** - Updated canonical URL, Open Graph URL, and email  
- ✅ **404.html** - Updated email reference

## 🎯 **Root Domain Only Strategy**
Using only `kryshairies.com.au` (no www subdomain) for:
- ✅ **Simpler SSL management** - no certificate chain issues
- ✅ **Better SEO** - single domain authority
- ✅ **Modern web standard** - cleaner branding
- ✅ **Easier maintenance** - one domain to manage

## 🔧 **DNS Configuration Required**

### **Remove WWW CNAME Record:**
1. **Go to Azure Portal** → **DNS zones** → **kryshairies.com.au**
2. **Find the CNAME record**: `www` → `witty-cliff-0c75bee00.3.azurestaticapps.net`
3. **Delete this CNAME record**

### **Keep Only A Record:**
```
Type: A
Name: @ (root domain)
Value: 13.75.93.156
TTL: 300
```

## 🚀 **Optional: WWW Redirect Setup**

If you want users typing `www.kryshairies.com.au` to redirect to `kryshairies.com.au`:

### **Option 1: Azure DNS Redirect (Recommended)**
1. **Create CNAME record**:
   ```
   Type: CNAME
   Name: www
   Value: kryshairies.com.au
   TTL: 300
   ```

### **Option 2: No WWW Record (Simplest)**
- Leave www undefined - users will get "domain not found"
- Most users don't type www anyway

## 🔍 **Testing After DNS Changes**

### **Test Commands:**
```bash
# Test root domain (should work)
curl -I https://kryshairies.com.au

# Test www (should fail after CNAME removal)
curl -I https://www.kryshairies.com.au

# Verify DNS changes
nslookup kryshairies.com.au
nslookup www.kryshairies.com.au
```

### **Expected Results:**
- ✅ https://kryshairies.com.au - Works perfectly with SSL
- ❌ https://www.kryshairies.com.au - Domain not found (or redirects if you choose Option 1)

## 📧 **Email Configuration**
All email addresses now use: `info@kryshairies.com.au`

## 🎯 **Current Status**

- ✅ **Website Code**: Ready with kryshairies.com.au references
- ✅ **Root Domain DNS**: Working perfectly  
- ⏳ **WWW CNAME Removal**: Waiting for your action
- ✅ **SSL Certificate**: Perfect on root domain

## 📱 **Final Website URLs**

**Primary Website**: https://kryshairies.com.au  
**Email**: info@kryshairies.com.au

---

**Next Action**: Remove the www CNAME record from Azure DNS to eliminate SSL certificate issues.