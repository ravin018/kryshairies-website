# ADR-0001: Azure Static Web Apps as Hosting Platform

**Status**: Accepted  
**Date**: 2025-01-01  
**Deciders**: Krysh HVAC Development Team  

## Context

Krysh HVAC needs a modern, performant, and cost-effective website to showcase their HVAC services across Melbourne's western suburbs. The website must include:

- Multi-page static content (Home, Services, About, Gallery, Blog, Contact)
- Contact form with email functionality
- Professional design with excellent performance
- SEO optimization
- Mobile responsiveness
- Easy content management
- Reliable hosting with good uptime
- Cost-effective solution for a small business

## Decision

We have decided to use **Azure Static Web Apps** as the hosting platform for the Krysh HVAC website.

## Alternatives Considered

### 1. Traditional Shared Hosting + WordPress
**Pros:**
- Familiar CMS interface
- Large ecosystem of themes and plugins
- Easy content management for non-technical users

**Cons:**
- Performance overhead from PHP/MySQL
- Security vulnerabilities requiring constant updates
- Higher ongoing maintenance requirements
- Database dependency
- Slower loading times
- Higher hosting costs over time

### 2. Virtual Private Server (VPS)
**Pros:**
- Complete control over server environment
- Can run any technology stack
- Customizable configuration

**Cons:**
- Requires server administration expertise
- Higher maintenance overhead
- Security management responsibility
- More expensive for small business
- Need to manage backups, updates, monitoring

### 3. Content Delivery Network (CDN) + Static Hosting (Netlify/Vercel)
**Pros:**
- Excellent performance with global CDN
- Git-based workflows
- Good developer experience
- Automatic deployments

**Cons:**
- Limited server-side functionality without additional services
- More complex setup for contact forms
- Potential vendor lock-in
- May require multiple services for complete solution

### 4. GitHub Pages
**Pros:**
- Free hosting
- Integrated with GitHub
- Simple deployment

**Cons:**
- Static only (no server-side functionality)
- Limited customization options
- No form handling capabilities
- Jekyll dependency for dynamic features

## Rationale

Azure Static Web Apps was chosen because it provides the optimal balance of:

### **Performance Benefits**
- **Global CDN**: Automatic distribution across Azure's global network
- **Static File Serving**: Optimized for static content delivery
- **HTTP/2 Support**: Modern protocol for faster loading
- **Compression**: Automatic gzip/brotli compression
- **Edge Caching**: Content cached at edge locations near users

### **Developer Experience**
- **Git Integration**: Automatic deployment from GitHub
- **CI/CD Pipeline**: Built-in GitHub Actions workflow
- **Preview Deployments**: Automatic preview environments for pull requests
- **Local Development**: Azure Static Web Apps CLI for local testing
- **Zero Configuration**: Minimal setup required

### **Scalability & Reliability**
- **Auto-scaling**: Handles traffic spikes automatically
- **99.95% SLA**: Enterprise-grade uptime guarantee
- **Global Infrastructure**: Azure's worldwide data centers
- **DDoS Protection**: Built-in protection against attacks

### **Cost Effectiveness**
- **Free Tier Available**: Generous free tier for small businesses
- **Pay-as-you-scale**: Only pay for what you use
- **No Infrastructure Costs**: No servers to maintain
- **Predictable Pricing**: Clear pricing structure

### **Security Features**
- **HTTPS by Default**: Automatic SSL certificates
- **Custom Domain Support**: Free SSL for custom domains
- **Security Headers**: Built-in security header configuration
- **Authentication Integration**: Easy integration with Azure AD/social providers

### **API Integration**
- **Azure Functions**: Integrated serverless functions for contact form
- **API Routes**: Custom API endpoints for dynamic functionality
- **Environment Variables**: Secure configuration management
- **SendGrid Integration**: Easy email service integration

### **SEO & Performance**
- **Static HTML**: Search engine friendly content
- **Fast Loading**: Optimized static file delivery
- **Custom Headers**: Control over HTTP headers
- **Sitemap Support**: Standard SEO files supported

## Implementation Details

### **Architecture**
```
GitHub Repository
    ↓ (Git push)
GitHub Actions
    ↓ (Build & Deploy)
Azure Static Web Apps
    ├── Static Files (HTML, CSS, JS, Images)
    ├── API Routes (Azure Functions)
    └── CDN Distribution
```

### **Technology Stack**
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **API**: Azure Functions (Node.js 18)
- **Email Service**: SendGrid
- **CI/CD**: GitHub Actions
- **Domain**: Custom domain with automatic HTTPS

### **File Structure**
```
/
├── index.html, services.html, etc.  # Static pages
├── style.css                        # Styles
├── script.js                        # Client-side JavaScript
├── /api/contact/                     # Azure Functions
├── staticwebapp.config.json          # SWA configuration
├── sitemap.xml, robots.txt           # SEO files
└── /.github/workflows/               # CI/CD pipeline
```

## Benefits Realized

### **For Business (Krysh HVAC)**
1. **Cost Savings**: No ongoing server maintenance costs
2. **Reliability**: 99.95% uptime SLA
3. **Performance**: Fast loading times improve customer experience
4. **Scalability**: Can handle traffic growth without infrastructure changes
5. **Security**: Enterprise-grade security without management overhead

### **For Development Team**
1. **Simplified Deployment**: Git-based workflow
2. **No Server Management**: Focus on features, not infrastructure
3. **Modern Development**: Use latest web technologies
4. **Easy Testing**: Preview deployments for every pull request
5. **Monitoring**: Built-in analytics and logging

### **For Users/Customers**
1. **Fast Loading**: Optimized content delivery
2. **Mobile Optimized**: Responsive design works across devices
3. **Reliable**: High availability and uptime
4. **Secure**: HTTPS by default
5. **Accessible**: Modern web standards compliance

## Risks and Mitigation

### **Vendor Lock-in Risk**
- **Risk**: Dependency on Azure platform
- **Mitigation**: Standard web technologies used; easy to migrate static files
- **Backup Plan**: Export static files and redeploy to any static hosting service

### **Azure Service Limitations**
- **Risk**: Azure Static Web Apps feature limitations
- **Mitigation**: Current features meet all requirements; can migrate to VPS if needed
- **Monitoring**: Regular review of service capabilities vs. business needs

### **Cost Escalation**
- **Risk**: Costs may increase with traffic growth
- **Mitigation**: Free tier covers expected traffic; pricing is predictable and transparent
- **Monitoring**: Set up billing alerts and regular cost reviews

### **Learning Curve**
- **Risk**: Team needs to learn Azure-specific features
- **Mitigation**: Comprehensive documentation provided; standard web technologies used
- **Training**: Investment in team training on Azure platform

## Success Metrics

The success of this decision will be measured by:

1. **Performance Metrics**
   - Lighthouse scores ≥ 90 across all categories
   - Page load times < 2 seconds
   - Core Web Vitals in "Good" range

2. **Reliability Metrics**
   - Uptime ≥ 99.9%
   - Zero deployment-related downtime
   - Successful contact form submissions ≥ 99%

3. **Business Metrics**
   - Reduced hosting costs vs. traditional hosting
   - Faster time-to-market for website updates
   - Improved search engine rankings

4. **Developer Experience**
   - Deployment time < 5 minutes
   - Zero manual deployment steps
   - Easy rollback capability

## Future Considerations

### **Potential Enhancements**
1. **Content Management**: Consider headless CMS integration if content updates become frequent
2. **E-commerce**: Evaluate e-commerce capabilities if online bookings needed
3. **Advanced Analytics**: Implement detailed user behavior tracking
4. **Personalization**: Add personalized content based on user location

### **Technology Evolution**
1. **Framework Adoption**: Consider modern frameworks (React, Vue) if complexity increases
2. **API Expansion**: Add more Azure Functions for enhanced functionality
3. **Third-party Integrations**: CRM, booking systems, payment processing

### **Scaling Considerations**
1. **Traffic Growth**: Monitor usage and upgrade plan if needed
2. **Geographic Expansion**: Leverage Azure's global infrastructure
3. **Team Growth**: Azure DevOps integration for larger development teams

## Review Schedule

This architectural decision will be reviewed:
- **Quarterly**: Performance and cost analysis
- **Annually**: Full architectural review
- **As needed**: When business requirements change significantly

## References

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Static Web Apps Pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/static/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
- [SendGrid Azure Integration](https://docs.sendgrid.com/for-developers/partners/microsoft-azure)

---

**Document Prepared By**: Development Team  
**Approved By**: Krysh HVAC Management  
**Next Review Date**: 2025-04-01
