import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Your email address where you want to receive contact form messages
const YOUR_EMAIL = process.env.CONTACT_EMAIL || 'thechris241103@gmail.com';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ 
      error: 'Email service not configured. Please set RESEND_API_KEY environment variable.' 
    });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Change this to your verified domain
      to: [YOUR_EMAIL],
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
            <p>This message was sent from your portfolio contact form.</p>
            <p>You can reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Message

Name: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent from your portfolio contact form.
You can reply directly to this email to respond to ${name}.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    // Success
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data?.id 
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

