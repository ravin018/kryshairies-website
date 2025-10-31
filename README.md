# Krysh HVAC Website

🌟 **Professional HVAC services website for Melbourne's western suburbs**

[![Azure Static Web Apps CI/CD](https://github.com/YOUR_GITHUB_USERNAME/kryshvac-site/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/kryshvac-site/actions)
[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-90%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Features

- **High Performance**: Lighthouse scores 90+ across all metrics
- **Mobile-First Design**: Responsive and accessible on all devices
- **SEO Optimized**: Complete meta tags, schema markup, and sitemap
- **Serverless Contact Form**: Azure Functions with SendGrid email integration
- **CI/CD Pipeline**: Automated deployment via GitHub Actions
- **Security Headers**: HTTPS, CSP, and security best practices
- **Fast Loading**: Optimized assets and minimal dependencies

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Azure Functions (Node.js 18)
- **Hosting**: Azure Static Web Apps
- **Email**: SendGrid API
- **CI/CD**: GitHub Actions
- **Analytics**: Ready for Google Analytics 4 or Plausible

## 📁 Project Structure

```
/
├── index.html              # Homepage
├── services.html           # Services page with FAQ schema
├── about.html              # About page
├── gallery.html            # Project gallery with filters
├── blog.html               # Blog listing page
├── contact.html            # Contact page with form
├── style.css               # Main stylesheet
├── script.js               # Main JavaScript file
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine instructions
├── staticwebapp.config.json # SWA configuration
├── package.json            # Node.js dependencies
├── /api/contact/           # Azure Functions API
│   ├── index.js            # Contact form handler
│   └── function.json       # Function configuration
├── /assets/                # Images, icons, and media
├── /docs/                  # Documentation
└── /.github/               # GitHub workflows and templates
```

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ installed
- Azure account (for production deployment)
- SendGrid account (for email functionality)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/kryshvac-site.git
   cd kryshvac-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Azure Static Web Apps CLI**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

4. **Start local development server**
   ```bash
   swa start . --api-location api
   ```

5. **Open in browser**
   ```
   http://localhost:4280
   ```

The site will be available at `http://localhost:4280` with the API at `http://localhost:7071/api`.

## 🚀 Deployment

### Azure Static Web Apps Deployment

1. **Create Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create new Static Web App
   - Connect to your GitHub repository
   - Set build details:
     - App location: `/`
     - API location: `api`
     - Output location: `/`

2. **Configure Environment Variables**
   ```bash
   # In Azure Portal → Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key
   TO_EMAIL=your_business_email@kryshvac.com.au
   FROM_EMAIL=noreply@kryshvac.com.au
   ```

3. **GitHub Secrets**
   Add to repository secrets:
   ```
   AZURE_STATIC_WEB_APPS_API_TOKEN=your_deployment_token
   ```

### Custom Domain Setup

1. **DNS Configuration**
   ```
   Type: CNAME
   Name: @
   Value: your-static-web-app.azurestaticapps.net
   ```

2. **Azure Portal Configuration**
   - Static Web Apps → Custom domains
   - Add custom domain: `kryshvac.com.au`
   - Validate domain ownership
   - Enable HTTPS (automatic with Azure)

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SENDGRID_API_KEY` | SendGrid API key for email | Yes (for email) |
| `TO_EMAIL` | Business email for contact form | Yes (for email) |
| `FROM_EMAIL` | From email address | No (defaults to noreply@kryshvac.com.au) |

### Analytics Setup

#### Google Analytics 4
```html
<!-- Replace GA_MEASUREMENT_ID with your actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Plausible Analytics (Privacy-friendly alternative)
```html
<script defer data-domain="kryshvac.com.au" src="https://plausible.io/js/script.js"></script>
```

## 🎨 Customization

### Brand Colors
Update CSS custom properties in `style.css`:
```css
:root {
  --primary-color: #2563eb;      /* Main blue */
  --secondary-color: #0891b2;    /* Teal */
  --accent-color: #06b6d4;       /* Light blue */
  /* ... other colors */
}
```

### Logo and Images
- Replace `/assets/logo.svg` with your logo
- Update images in `/assets/` directory
- Optimize images for web (WebP recommended)

### Content Updates
- Edit HTML files directly for content changes
- Update contact information in all files
- Modify service offerings in `services.html`

### Adding Blog Posts
1. Add new blog post cards to `blog.html`
2. Create individual blog post pages
3. Update sitemap.xml with new URLs

## 📊 Performance

### Lighthouse Scores (Target: 90+)
- ✅ Performance: 95+
- ✅ Accessibility: 95+
- ✅ Best Practices: 95+
- ✅ SEO: 100

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔒 Security

### Implemented Security Measures
- HTTPS enforcement
- Security headers (CSP, HSTS, X-Frame-Options)
- Input validation and sanitization
- No sensitive data in repository
- CORS configuration

### Security Headers
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}
```

## 🧪 Testing

### HTML Validation
```bash
# Automated via GitHub Actions
# Manual check: https://validator.w3.org/
```

### Link Checking
```bash
# Automated via GitHub Actions using Lychee
# Manual check with lychee CLI
npx lychee ./**/*.html
```

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance (WCAG 2.1 AA)
- Focus indicators

### Contact Form Testing
```bash
# Test API endpoint
curl -X POST http://localhost:7071/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"0412345678","suburb":"Melbourne","message":"Test message"}'
```

## 🔄 Maintenance

### Regular Tasks
- [ ] **Monthly**: Check and update dependencies
- [ ] **Monthly**: Review and update content
- [ ] **Quarterly**: Run accessibility audit
- [ ] **Quarterly**: Performance review and optimization
- [ ] **Annually**: Review and update SEO strategy

### Backup Strategy
- Code: GitHub repository (automatically backed up)
- DNS settings: Document in team wiki
- Azure configuration: Export ARM templates
- Analytics data: Regular exports

### Monitoring
- **Uptime**: Azure App Insights
- **Performance**: Google PageSpeed Insights
- **Analytics**: GA4 or Plausible dashboard
- **Errors**: Azure Function logs

## 🐛 Troubleshooting

### Common Issues

**Contact form not sending emails**
```bash
# Check Azure Function logs
# Verify SENDGRID_API_KEY and TO_EMAIL are set
# Test SendGrid API key validity
```

**DNS propagation delays**
```bash
# Check DNS propagation
dig kryshvac.com.au
nslookup kryshvac.com.au

# DNS propagation can take 24-48 hours
```

**Build failures**
```bash
# Check GitHub Actions logs
# Verify package.json dependencies
# Check for HTML validation errors
```

**Performance issues**
```bash
# Run Lighthouse audit
# Optimize images (convert to WebP)
# Minimize CSS/JS
# Check for render-blocking resources
```

### Getting Help

1. **Check GitHub Issues**: [Issues page](https://github.com/YOUR_GITHUB_USERNAME/kryshvac-site/issues)
2. **Azure Support**: For hosting issues
3. **SendGrid Support**: For email delivery issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test locally
4. Commit with descriptive messages: `git commit -m "Add new service page"`
5. Push to branch: `git push origin feature/new-feature`
6. Create Pull Request

### Code Style
- Use 2 spaces for indentation
- Follow semantic HTML5 standards
- Use BEM methodology for CSS classes
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions about this website:

- **Email**: dev@kryshvac.com.au
- **Phone**: +61 3 XXXX XXXX
- **GitHub Issues**: [Create an issue](https://github.com/YOUR_GITHUB_USERNAME/kryshvac-site/issues)

---

**Built with ❤️ for Krysh HVAC**

*Reliable heating and cooling solutions across Melbourne's western suburbs*
