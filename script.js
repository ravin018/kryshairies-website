// Krysh HVAC Website JavaScript
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Contact Form Handling
if (document.getElementById('contactForm')) {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        submitBtn.classList.add('loading');
        
        // Clear previous messages
        formMessage.innerHTML = '';
        formMessage.className = '';

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Client-side validation
        const errors = validateForm(data);
        if (errors.length > 0) {
            showFormMessage(errors.join('<br>'), 'error');
            resetSubmitButton();
            return;
        }

        try {
            // Submit to Azure Function
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
        } finally {
            resetSubmitButton();
        }
    });

    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter your full name (at least 2 characters)');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        if (!data.suburb || data.suburb.trim().length < 2) {
            errors.push('Please enter your suburb');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Please enter a message (at least 10 characters)');
        }

        return errors;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        formMessage.innerHTML = message;
        formMessage.className = `form-message ${type === 'success' ? 'form-success' : 'form-error'}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function resetSubmitButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
        submitBtn.classList.remove('loading');
    }
}

// Gallery Filter Functionality
if (document.querySelector('.gallery-filters')) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Load More Gallery Items (if implemented)
if (document.getElementById('loadMore')) {
    document.getElementById('loadMore').addEventListener('click', function() {
        // This would typically load more items via AJAX
        // For now, just show a message
        this.textContent = 'All projects shown';
        this.disabled = true;
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .feature, .testimonial, .value-card, .stat-item').forEach(el => {
    observer.observe(el);
});

// Performance: Lazy load images that aren't already lazy
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
} else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Form Input Enhancement
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentNode.classList.remove('focused');
        }
    });
    
    // Remove error styling when user starts typing
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorMsg = this.parentNode.querySelector('.form-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
});

// Accessibility: Skip Link
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link sr-only';
skipLink.addEventListener('focus', function() {
    this.classList.remove('sr-only');
});
skipLink.addEventListener('blur', function() {
    this.classList.add('sr-only');
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Error Handling for Missing Images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = '/assets/placeholder-image.jpg';
        this.alt = 'Image not available';
    });
});

// Simple Analytics Event Tracking (if analytics is loaded)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
        plausible(eventName, { props: eventData });
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, eventData);
}

// Track important interactions
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Track CTA button clicks
    if (target.classList.contains('btn-primary')) {
        trackEvent('cta_click', {
            button_text: target.textContent.trim(),
            page: window.location.pathname
        });
    }
    
    // Track phone number clicks
    if (target.href && target.href.startsWith('tel:')) {
        trackEvent('phone_click', {
            page: window.location.pathname
        });
    }
    
    // Track email clicks
    if (target.href && target.href.startsWith('mailto:')) {
        trackEvent('email_click', {
            page: window.location.pathname
        });
    }
});

// Track form submissions
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function() {
        trackEvent('form_submit', {
            form_name: 'contact',
            page: window.location.pathname
        });
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.now();
    
    trackEvent('page_load_time', {
        load_time: Math.round(loadTime),
        page: window.location.pathname
    });
    
    // Track Core Web Vitals if supported
    if ('PerformanceObserver' in window) {
        try {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                trackEvent('lcp', {
                    value: Math.round(lastEntry.startTime),
                    page: window.location.pathname
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                trackEvent('fid', {
                    value: Math.round(firstInput.processingStart - firstInput.startTime),
                    page: window.location.pathname
                });
            }).observe({ entryTypes: ['first-input'] });
        } catch (error) {
            console.log('Performance observation not fully supported');
        }
    }
});

console.log('Krysh HVAC website loaded successfully');
