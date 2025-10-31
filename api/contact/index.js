const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    context.log('Contact form submission received');

    // Set CORS headers
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        context.res = {
            ...context.res,
            status: 405,
            body: { error: 'Method not allowed. Use POST.' }
        };
        return;
    }

    try {
        // Parse request body
        let data;
        if (req.headers['content-type']?.includes('application/json')) {
            data = req.body;
        } else if (req.headers['content-type']?.includes('multipart/form-data') || 
                   req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            data = req.body;
        } else {
            throw new Error('Unsupported content type');
        }

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'suburb', 'message'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
            context.res = {
                ...context.res,
                status: 400,
                body: { 
                    error: 'Missing required fields', 
                    missingFields,
                    message: `Please provide: ${missingFields.join(', ')}`
                }
            };
            return;
        }

        // Additional validation
        const errors = [];
        
        // Name validation
        if (data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.push('Invalid phone number format');
        }
        
        // Message validation
        if (data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters');
        }

        if (errors.length > 0) {
            context.res = {
                ...context.res,
                status: 400,
                body: { 
                    error: 'Validation failed', 
                    errors,
                    message: errors.join(', ')
                }
            };
            return;
        }

        // Sanitize input data
        const sanitizedData = {
            name: sanitizeInput(data.name),
            email: sanitizeInput(data.email),
            phone: sanitizeInput(data.phone),
            suburb: sanitizeInput(data.suburb),
            message: sanitizeInput(data.message),
            service: sanitizeInput(data.service || 'General Inquiry'),
            preferredContact: sanitizeInput(data.preferredContact || 'Email'),
            submittedAt: new Date().toISOString(),
            userAgent: req.headers['user-agent'] || 'Unknown',
            ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown'
        };

        context.log('Form data validated and sanitized', { 
            name: sanitizedData.name, 
            email: sanitizedData.email,
            suburb: sanitizedData.suburb 
        });

        // Check for SendGrid configuration
        const sendGridApiKey = process.env.SENDGRID_API_KEY;
        const toEmail = process.env.TO_EMAIL;

        if (sendGridApiKey && toEmail) {
            // Send email via SendGrid
            sgMail.setApiKey(sendGridApiKey);

            // Email to business
            const businessEmail = {
                to: toEmail,
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@kryshvac.com.au',
                    name: 'Krysh HVAC Website'
                },
                replyTo: {
                    email: sanitizedData.email,
                    name: sanitizedData.name
                },
                subject: `New Contact Form Submission - ${sanitizedData.name}`,
                html: generateBusinessEmailHtml(sanitizedData),
                text: generateBusinessEmailText(sanitizedData)
            };

            // Auto-reply email to customer
            const customerEmail = {
                to: {
                    email: sanitizedData.email,
                    name: sanitizedData.name
                },
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@kryshvac.com.au',
                    name: 'Krysh HVAC'
                },
                subject: 'Thank you for contacting Krysh HVAC',
                html: generateCustomerEmailHtml(sanitizedData),
                text: generateCustomerEmailText(sanitizedData)
            };

            try {
                await Promise.all([
                    sgMail.send(businessEmail),
                    sgMail.send(customerEmail)
                ]);
                
                context.log('Emails sent successfully');
            } catch (emailError) {
                context.log.error('SendGrid error:', emailError);
                // Don't fail the request if email fails, just log it
            }
        } else {
            context.log('SendGrid not configured - logging form submission only');
            context.log('Contact form submission:', sanitizedData);
        }

        // Success response
        context.res = {
            ...context.res,
            status: 200,
            body: {
                success: true,
                message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
                submissionId: generateSubmissionId()
            }
        };

    } catch (error) {
        context.log.error('Contact form error:', error);
        
        context.res = {
            ...context.res,
            status: 500,
            body: {
                error: 'Internal server error',
                message: 'Sorry, there was an error processing your request. Please try again or call us directly.'
            }
        };
    }
};

// Helper functions
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function generateSubmissionId() {
    return 'SUB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateBusinessEmailHtml(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2563eb; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Name:</span> ${data.name}
            </div>
            <div class="field">
                <span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a>
            </div>
            <div class="field">
                <span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a>
            </div>
            <div class="field">
                <span class="label">Suburb:</span> ${data.suburb}
            </div>
            <div class="field">
                <span class="label">Service Interest:</span> ${data.service}
            </div>
            <div class="field">
                <span class="label">Preferred Contact:</span> ${data.preferredContact}
            </div>
            <div class="field">
                <span class="label">Message:</span><br>
                ${data.message.replace(/\n/g, '<br>')}
            </div>
            <div class="field">
                <span class="label">Submitted:</span> ${new Date(data.submittedAt).toLocaleString('en-AU')}
            </div>
        </div>
        <div class="footer">
            <p>This email was automatically generated from the Krysh HVAC website contact form.</p>
        </div>
    </div>
</body>
</html>`;
}

function generateBusinessEmailText(data) {
    return `
New Contact Form Submission - Krysh HVAC

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Suburb: ${data.suburb}
Service Interest: ${data.service}
Preferred Contact: ${data.preferredContact}

Message:
${data.message}

Submitted: ${new Date(data.submittedAt).toLocaleString('en-AU')}

---
This email was automatically generated from the Krysh HVAC website contact form.
`;
}

function generateCustomerEmailHtml(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You, ${data.name}!</h1>
        </div>
        <div class="content">
            <p>Thank you for contacting Krysh HVAC. We have received your inquiry about our HVAC services in ${data.suburb}.</p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>We will review your inquiry within 2 hours during business hours</li>
                <li>One of our certified technicians will contact you within 24 hours</li>
                <li>We'll provide a free, no-obligation quote for your HVAC needs</li>
            </ul>
            
            <p><strong>Your submission details:</strong></p>
            <ul>
                <li>Service Interest: ${data.service}</li>
                <li>Preferred Contact: ${data.preferredContact}</li>
                <li>Contact Phone: ${data.phone}</li>
            </ul>
            
            <p><strong>Need immediate assistance?</strong><br>
            Call us directly at <a href="tel:+61-3-XXXX-XXXX">+61 3 XXXX XXXX</a></p>
            
            <p>Thank you for choosing Krysh HVAC for your heating and cooling needs!</p>
        </div>
        <div class="footer">
            <p><strong>Krysh HVAC</strong><br>
            Professional HVAC Services<br>
            Serving Melbourne's Western Suburbs<br>
            <a href="https://kryshvac.com.au">kryshvac.com.au</a></p>
        </div>
    </div>
</body>
</html>`;
}

function generateCustomerEmailText(data) {
    return `
Thank You, ${data.name}!

Thank you for contacting Krysh HVAC. We have received your inquiry about our HVAC services in ${data.suburb}.

What happens next?
- We will review your inquiry within 2 hours during business hours
- One of our certified technicians will contact you within 24 hours  
- We'll provide a free, no-obligation quote for your HVAC needs

Your submission details:
- Service Interest: ${data.service}
- Preferred Contact: ${data.preferredContact}
- Contact Phone: ${data.phone}

Need immediate assistance?
Call us directly at +61 3 XXXX XXXX

Thank you for choosing Krysh HVAC for your heating and cooling needs!

---
Krysh HVAC
Professional HVAC Services
Serving Melbourne's Western Suburbs
https://kryshvac.com.au
`;
}
