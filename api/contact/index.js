const sgMail = require('@sendgrid/mail');
const OpenAI = require('openai');

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

        // AI Analysis of Customer Inquiry
        let aiAnalysis = null;
        const openaiApiKey = process.env.OPENAI_API_KEY;
        
        if (openaiApiKey) {
            try {
                const openai = new OpenAI({ apiKey: openaiApiKey });
                aiAnalysis = await analyzeCustomerInquiry(openai, sanitizedData);
                context.log('AI analysis completed successfully');
            } catch (aiError) {
                context.log.error('OpenAI analysis error:', aiError);
                // Continue without AI analysis if it fails
            }
        } else {
            context.log('OpenAI not configured - skipping AI analysis');
        }

        // Check for SendGrid configuration
        const sendGridApiKey = process.env.SENDGRID_API_KEY;
        const toEmail = process.env.TO_EMAIL;

        if (sendGridApiKey && toEmail) {
            // Send email via SendGrid
            sgMail.setApiKey(sendGridApiKey);

            // Email to business with AI analysis
            const businessEmailSubject = aiAnalysis 
                ? `[KryshAiries] New Inquiry - ${aiAnalysis.serviceCategory} - ${aiAnalysis.urgencyLevel}`
                : `[KryshAiries] New Contact Form Submission - ${sanitizedData.name}`;

            const businessEmail = {
                to: toEmail,
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@krysharies.com.au',
                    name: 'KryshAiries Website'
                },
                replyTo: {
                    email: sanitizedData.email,
                    name: sanitizedData.name
                },
                subject: businessEmailSubject,
                html: generateBusinessEmailHtml(sanitizedData, aiAnalysis),
                text: generateBusinessEmailText(sanitizedData, aiAnalysis)
            };

            // Auto-reply email to customer with personalized response
            const customerEmail = {
                to: {
                    email: sanitizedData.email,
                    name: sanitizedData.name
                },
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@krysharies.com.au',
                    name: 'KryshAiries Heating & Cooling'
                },
                subject: 'Thank you for contacting KryshAiries - Your Air, Our Care',
                html: generateCustomerEmailHtml(sanitizedData, aiAnalysis),
                text: generateCustomerEmailText(sanitizedData, aiAnalysis)
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

// AI Analysis Function
async function analyzeCustomerInquiry(openai, customerData) {
    try {
        const analysisPrompt = `Analyze this HVAC service inquiry and provide a structured response in JSON format:

Customer Details:
- Name: ${customerData.name}
- Email: ${customerData.email}
- Phone: ${customerData.phone}
- Suburb: ${customerData.suburb}
- Service: ${customerData.service}
- Message: ${customerData.message}
- Preferred Contact: ${customerData.preferredContact}

Please provide analysis in this exact JSON structure:
{
    "serviceCategory": "Split System/Ducted Heating/Evaporative Cooling/Commercial/Maintenance/Emergency/General",
    "urgencyLevel": "Low/Medium/High/Emergency",
    "complexityLevel": "Simple/Moderate/Complex",
    "recommendedResponseTime": "Within 2 hours/Same day/Next business day/Within 48 hours",
    "keyPoints": ["point1", "point2", "point3"],
    "followUpActions": ["action1", "action2"],
    "estimatedJobValue": "Under $500/$500-2000/$2000-5000/$5000+/Quote Required",
    "customerType": "Residential/Commercial/Emergency",
    "draftResponse": "Professional, personalized email response ready to copy-paste"
}

Focus on:
- HVAC technical requirements
- Urgency indicators
- Customer's work schedule (9-to-5 consideration)
- Melbourne climate considerations
- Professional but friendly tone for busy professionals`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert HVAC business analyst. Analyze customer inquiries for a Melbourne-based heating and cooling company that specializes in flexible scheduling for working professionals. Provide structured analysis and draft professional responses."
                },
                {
                    role: "user",
                    content: analysisPrompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        });

        const analysisText = completion.choices[0].message.content.trim();
        
        // Extract JSON from the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('No valid JSON found in OpenAI response');
        }
        
    } catch (error) {
        console.error('AI analysis error:', error);
        return null;
    }
}

// Updated Email Generation Functions
function generateBusinessEmailHtml(data, aiAnalysis) {
    const aiSection = aiAnalysis ? `
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin: 0 0 15px 0;">🤖 AI ANALYSIS</h3>
            
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Service Category:</h4>
                <p style="margin: 0; color: #666;">${aiAnalysis.serviceCategory}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Urgency Level:</h4>
                <p style="margin: 0; color: #666; font-weight: bold;">${aiAnalysis.urgencyLevel}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Recommended Response Time:</h4>
                <p style="margin: 0; color: #666;">${aiAnalysis.recommendedResponseTime}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Key Points to Address:</h4>
                <ul style="margin: 5px 0; color: #666;">
                    ${aiAnalysis.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Follow-up Actions:</h4>
                <ul style="margin: 5px 0; color: #666;">
                    ${aiAnalysis.followUpActions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Estimated Job Value:</h4>
                <p style="margin: 0; color: #666;">${aiAnalysis.estimatedJobValue}</p>
            </div>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin: 0 0 15px 0;">📝 DRAFT RESPONSE</h3>
            <div style="background-color: white; padding: 15px; border-radius: 5px; color: #333; line-height: 1.6;">
                ${aiAnalysis.draftResponse.replace(/\n/g, '<br>')}
            </div>
            <p style="font-size: 12px; color: #666; margin: 10px 0 0 0;">
                <em>Copy and paste the above response, then personalize as needed.</em>
            </p>
        </div>
    ` : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Customer Inquiry - KryshAiries</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">KryshAiries Heating & Cooling</h1>
            <p style="margin: 5px 0 0 0;">New Customer Inquiry</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">📞 CUSTOMER DETAILS</h3>
            <table style="width: 100%;">
                <tr><td style="font-weight: bold; padding: 5px 0;">Name:</td><td>${data.name}</td></tr>
                <tr><td style="font-weight: bold; padding: 5px 0;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td style="font-weight: bold; padding: 5px 0;">Phone:</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
                <tr><td style="font-weight: bold; padding: 5px 0;">Suburb:</td><td>${data.suburb}</td></tr>
                <tr><td style="font-weight: bold; padding: 5px 0;">Service:</td><td>${data.service}</td></tr>
                <tr><td style="font-weight: bold; padding: 5px 0;">Preferred Contact:</td><td>${data.preferredContact}</td></tr>
                <tr><td style="font-weight: bold; padding: 5px 0;">Submitted:</td><td>${new Date(data.submittedAt).toLocaleString('en-AU')}</td></tr>
            </table>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #495057; margin: 0 0 15px 0;">💬 CUSTOMER MESSAGE</h3>
            <p style="background-color: white; padding: 15px; border-radius: 5px; margin: 0;">${data.message}</p>
        </div>
        
        ${aiSection}
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; text-align: center; border-top: 3px solid #007bff;">
            <p style="margin: 0; color: #666;">
                <strong>KryshAiries Heating & Cooling</strong><br>
                Your Air, Our Care<br>
                Flexible scheduling for working professionals
            </p>
        </div>
    </div>
</body>
</html>`;
}

function generateBusinessEmailText(data, aiAnalysis) {
    const aiSection = aiAnalysis ? `

=== AI ANALYSIS ===

Service Category: ${aiAnalysis.serviceCategory}
Urgency Level: ${aiAnalysis.urgencyLevel}
Recommended Response Time: ${aiAnalysis.recommendedResponseTime}
Complexity Level: ${aiAnalysis.complexityLevel}
Estimated Job Value: ${aiAnalysis.estimatedJobValue}

Key Points to Address:
${aiAnalysis.keyPoints.map(point => `- ${point}`).join('\n')}

Follow-up Actions:
${aiAnalysis.followUpActions.map(action => `- ${action}`).join('\n')}

=== DRAFT RESPONSE ===
${aiAnalysis.draftResponse}

(Copy and paste the above response, then personalize as needed)

` : '';

    return `KryshAiries Heating & Cooling - New Customer Inquiry

CUSTOMER DETAILS:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- Suburb: ${data.suburb}
- Service: ${data.service}
- Preferred Contact: ${data.preferredContact}
- Submitted: ${new Date(data.submittedAt).toLocaleString('en-AU')}

CUSTOMER MESSAGE:
${data.message}

${aiSection}

---
KryshAiries Heating & Cooling
Your Air, Our Care
Flexible scheduling for working professionals
https://krysharies.com.au
`;
}

function generateCustomerEmailHtml(data, aiAnalysis) {
    // Use AI-generated response if available, otherwise use standard response
    const responseMessage = aiAnalysis?.draftResponse || `
Dear ${data.name},

Thank you for contacting KryshAiries Heating & Cooling. We appreciate your interest in our services and will get back to you soon.

We understand that as a working professional, you need flexibility in scheduling. That's why we offer evening and weekend appointments to work around your busy schedule.

Our ARC certified technicians will provide you with a comprehensive assessment and competitive quote for your ${data.service} needs in ${data.suburb}.

We'll contact you within 24 hours via your preferred method (${data.preferredContact}) to discuss your requirements and arrange a suitable time for consultation.

Best regards,
The KryshAiries Team
`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thank you for contacting KryshAiries</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #007bff; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">KryshAiries</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Your Air, Our Care</p>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
            <div style="background-color: white; padding: 25px; border-radius: 8px;">
                ${responseMessage.replace(/\n/g, '<br><br>')}
            </div>
        </div>
        
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Need immediate assistance?</h3>
            <p style="margin: 0; font-size: 20px;">
                📞 <a href="tel:+61418157327" style="color: white; text-decoration: none;">0418 157 327</a>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Text for 4-hour response!</p>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0;">
                <strong>KryshAiries Heating & Cooling</strong><br>
                Professional HVAC Services<br>
                Serving Melbourne's Western Suburbs<br>
                <a href="https://krysharies.com.au" style="color: #007bff;">krysharies.com.au</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

function generateCustomerEmailText(data, aiAnalysis) {
    const responseMessage = aiAnalysis?.draftResponse || `
Dear ${data.name},

Thank you for contacting KryshAiries Heating & Cooling. We appreciate your interest in our services and will get back to you soon.

We understand that as a working professional, you need flexibility in scheduling. That's why we offer evening and weekend appointments to work around your busy schedule.

Our ARC certified technicians will provide you with a comprehensive assessment and competitive quote for your ${data.service} needs in ${data.suburb}.

We'll contact you within 24 hours via your preferred method (${data.preferredContact}) to discuss your requirements and arrange a suitable time for consultation.

Best regards,
The KryshAiries Team
`;

    return `KryshAiries Heating & Cooling - Your Air, Our Care

${responseMessage}

Need immediate assistance?
Call us directly at 0418 157 327
Text for 4-hour response!

Your submission details:
- Service Interest: ${data.service}
- Preferred Contact: ${data.preferredContact}
- Contact Phone: ${data.phone}

Thank you for choosing KryshAiries for your heating and cooling needs!

---
KryshAiries Heating & Cooling
Your Air, Our Care - Professional HVAC Services
Serving Melbourne's Western Suburbs
https://krysharies.com.au
`;
}
