#!/bin/bash

# Krysh HVAC Website - Complete Deployment Commands
# Run these commands step by step to deploy your website

echo "🏗️ Krysh HVAC Website Deployment Guide"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
    echo "----------------------------------------"
}

print_command() {
    echo -e "${YELLOW}Command:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

echo "This script will guide you through deploying the KryshAiries website."
echo ""
print_info "Project Structure:"
echo "- Static Website: HTML/CSS/JavaScript (no build process needed)"
echo "- API: Azure Functions (Node.js) for contact form functionality"
echo "- npm is only used for API dependencies and Azure CLI tools"
echo ""
echo "Make sure you have the following prerequisites:"
echo "- Azure account with active subscription"
echo "- GitHub account"
echo "- SendGrid account"
echo "- Domain registrar access (for kryshairies.com.au)"
echo ""

read -p "Do you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
print_step "1" "Install Required Tools"
echo ""

# Check if tools are installed
echo "Checking for required tools..."

# Azure CLI
if command -v az &> /dev/null; then
    print_success "Azure CLI is installed"
else
    print_error "Azure CLI is not installed"
    echo "Install with: brew install azure-cli"
    echo "Or visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
fi

# GitHub CLI
if command -v gh &> /dev/null; then
    print_success "GitHub CLI is installed"
else
    print_error "GitHub CLI is not installed"
    echo "Install with: brew install gh"
    echo "Or visit: https://github.com/cli/cli#installation"
fi

# Node.js
if command -v node &> /dev/null; then
    print_success "Node.js is installed ($(node --version))"
else
    print_error "Node.js is not installed"
    echo "Install with: brew install node"
    echo "Or visit: https://nodejs.org/"
fi

# SWA CLI
if command -v swa &> /dev/null; then
    print_success "Azure Static Web Apps CLI is installed"
else
    print_info "Azure Static Web Apps CLI will be installed"
    print_command "npm install -g @azure/static-web-apps-cli"
fi

echo ""
print_step "2" "Local Development Setup"
echo ""

print_info "To test the website locally, run these commands:"
echo ""
print_command "cd /Users/ravindrasingh/Documents/kryshvac"
print_info "Install API dependencies (for contact form functionality):"
print_command "npm install"
print_info "Install Azure Static Web Apps CLI for local testing:"
print_command "npm install -g @azure/static-web-apps-cli"
print_command "swa start . --api-location api"
echo ""
echo "Then open: http://localhost:4280"
echo ""

print_step "3" "GitHub Repository Setup"
echo ""

print_info "If you haven't set up the repository yet, run:"
print_command "./setup-github.sh"
echo ""
print_info "Or manually create it with:"
print_command "gh auth login"
print_command "gh repo create kryshairies-website --public --description 'Professional HVAC website for KryshAiries'"
print_command "git remote add origin https://github.com/ravin018/kryshairies-website.git"

print_info "⚠️ IMPORTANT: Before pushing, increase git buffer size to handle large files:"
print_command "git config --global http.postBuffer 524288000"
print_info "This prevents 'HTTP 400' errors when pushing to GitHub."

print_command "git push -u origin main"
echo ""

print_step "4" "Azure Static Web Apps Setup"
echo ""

print_info "1. Login to Azure:"
print_command "az login"
echo ""

print_info "2. Create resource group:"
print_command "az group create --name rg-kryshairies-prod --location australiaeast"
echo ""

print_info "3. Create Static Web App (via Azure Portal):"
echo "   - Go to portal.azure.com"
echo "   - Create a resource → Web → Static Web App"
echo "   - Name: kryshairies-webapp"
echo "   - Resource Group: rg-kryshairies-prod"
echo "   - Region: Australia East"
echo "   - Source: GitHub"
echo "   - Repository: kryshairies-website"
echo "   - Branch: main"
echo "   - Build Presets: Custom"
echo "   - App location: /"
echo "   - Api location: api"
echo "   - Output location: /"
echo ""

print_info "⚠️ CRITICAL: Package.json Structure for Deployment Success"
echo "Ensure you have separate package.json files:"
echo "1. Root package.json (minimal, no heavy dependencies):"
echo "   - Only build script: 'echo Static website - no build required && exit 0'"
echo "   - No SendGrid or OpenAI dependencies here"
echo ""
echo "2. api/package.json (for Azure Functions only):"
echo "   - Contains @sendgrid/mail and openai dependencies"
echo "   - This prevents 250MB size limit issues during deployment"
echo ""
print_info "This separation is crucial to avoid Azure's 250MB free tier limit!"
echo ""
echo "   - Api location: api"
echo "   - Output location: /"
echo ""

print_step "5" "Configure GitHub Secrets"
echo ""

print_info "After creating the Static Web App, add the deployment token to GitHub:"
echo "1. In Azure Portal: Static Web App → Configuration → Manage deployment token"
echo "2. Copy the token"
echo "3. In GitHub: Repository → Settings → Secrets and variables → Actions"
echo "4. Add new secret:"
echo "   Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   Value: [paste the deployment token]"
echo ""

print_step "6" "SendGrid Configuration"
echo ""

print_info "Set up SendGrid for the contact form:"
echo "1. Create account at sendgrid.com"
echo "2. Generate API key with Full Access"
echo "3. Set up sender authentication"
echo "4. Add environment variables in Azure Portal:"
echo "   Static Web App → Configuration → Application settings"
echo ""
echo "   SENDGRID_API_KEY: [your API key]"
echo "   TO_EMAIL: info@kryshairies.com.au"
echo "   FROM_EMAIL: noreply@kryshairies.com.au"
echo ""

print_step "7" "Custom Domain Setup"
echo ""

print_info "Configure custom domain (kryshairies.com.au):"
echo "1. In your domain registrar, add CNAME records:"
echo "   Type: CNAME"
echo "   Name: @"
echo "   Value: [your-static-web-app].azurestaticapps.net"
echo ""
echo "   Type: CNAME"  
echo "   Name: www"
echo "   Value: [your-static-web-app].azurestaticapps.net"
echo ""
echo "2. In Azure Portal:"
echo "   Static Web App → Custom domains → Add"
echo "   Domain: kryshairies.com.au"
echo "   Validation: DNS TXT record"
echo ""

print_step "8" "Testing and Verification"
echo ""

print_info "Test the deployed website:"
echo "1. Visit your Static Web App URL (check deployment logs for correct .X.azurestaticapps.net URL)"
echo "2. Test all pages and navigation"
echo "3. Submit the contact form"
echo "4. Verify email delivery"
echo "5. Run Lighthouse audit (target: 90+ scores)"
echo "6. Test mobile responsiveness"
echo ""

print_info "🔍 Troubleshooting Common Deployment Issues:"
echo ""
echo "404 Errors:"
echo "- Check GitHub Actions logs for build failures"
echo "- Verify correct Azure Static Web App URL (might be .1, .3, etc.)"
echo "- Ensure HTML files are in root directory"
echo ""
echo "Size Limit Errors (250MB exceeded):"
echo "- Separate package.json dependencies (root vs api folder)"
echo "- Check .gitignore excludes node_modules and large files"
echo "- Remove unnecessary dependencies from root package.json"
echo ""
echo "HTML Validation Errors:"
echo "- Move <style> tags from <body> to <head>"
echo "- Validate HTML structure before deployment"
echo ""

print_step "9" "SEO and Analytics Setup"
echo ""

print_info "Complete the SEO setup:"
echo "1. Google Search Console:"
echo "   - Add property: https://kryshairies.com.au"
echo "   - Verify ownership"
echo "   - Submit sitemap: https://kryshairies.com.au/sitemap.xml"
echo ""
echo "2. Analytics (choose one):"
echo "   - Google Analytics 4: Add tracking code to all pages"
echo "   - Plausible: Add privacy-friendly analytics script"
echo ""

print_step "10" "Content Updates"
echo ""

print_info "Replace placeholder content:"
echo "1. Add professional photos to /assets/ directory"
echo "2. Update contact information (phone, email, address)"
echo "3. Customize service descriptions"
echo "4. Add real testimonials"
echo "5. Update team member information"
echo ""

echo ""
print_success "Deployment guide complete!"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - docs/DEPLOYMENT.md (Step-by-step deployment guide)"
echo "   - docs/DESIGN.md (Design system and customization)"
echo "   - docs/GITHUB_COMMIT_ISSUE.md (GitHub push troubleshooting)"
echo "   - README.md (Complete project documentation)"
echo ""
echo "🆘 Need help?"
echo "   - Check Azure Portal for deployment logs"
echo "   - Review GitHub Actions for build issues"
echo "   - Test contact form with browser dev tools"
echo "   - Verify DNS propagation with: dig kryshairies.com.au"
echo "   - For GitHub push errors: git config --global http.postBuffer 524288000"
echo ""
print_success "Good luck with your deployment! 🚀"
