import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Inline storage functions to avoid import issues
interface Subscription {
  email: string;
  subscribedAt: string;
  verified: boolean;
}

let subscriptionsCache: Subscription[] | null = null;

async function getSubscriptions(): Promise<Subscription[]> {
  // Try to fetch from external storage
  const storageUrl = process.env.SUBSCRIPTIONS_STORAGE_URL;
  
  if (storageUrl) {
    try {
      const response = await fetch(storageUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        subscriptionsCache = Array.isArray(data) ? data : [];
        return subscriptionsCache;
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  }
  
  // Return cache or empty array
  return subscriptionsCache || [];
}

async function saveSubscriptions(subscriptions: Subscription[]): Promise<void> {
  // Update cache
  subscriptionsCache = subscriptions;
  
  // Try to save to external storage
  const storageUrl = process.env.SUBSCRIPTIONS_STORAGE_URL;
  const storageApiKey = process.env.SUBSCRIPTIONS_STORAGE_API_KEY;
  
  if (storageUrl && storageApiKey) {
    try {
      await fetch(storageUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storageApiKey}`,
        },
        body: JSON.stringify(subscriptions),
      });
    } catch (error) {
      console.error('Error saving subscriptions:', error);
      // Continue - at least we have cache
    }
  }
}

async function addSubscription(email: string): Promise<{ success: boolean; alreadyExists: boolean }> {
  const subscriptions = await getSubscriptions();
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if already exists
  const exists = subscriptions.some(s => s.email === normalizedEmail);
  if (exists) {
    return { success: true, alreadyExists: true };
  }
  
  // Add new subscription
  subscriptions.push({
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
    verified: true,
  });
  
  await saveSubscriptions(subscriptions);
  return { success: true, alreadyExists: false };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Wrap everything in try-catch to handle any errors
  try {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ 
      error: 'Email service not configured. Please set RESEND_API_KEY environment variable.' 
    });
  }

  // GET - Return subscription count (for admin purposes)
  if (req.method === 'GET') {
    const subscriptions = await getSubscriptions();
    return res.status(200).json({ 
      count: subscriptions.length,
      subscriptions: subscriptions.map(s => ({ email: s.email, subscribedAt: s.subscribedAt }))
    });
  }

  // POST - Subscribe email
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      // Add subscription (handles duplicate check)
      const result = await addSubscription(email);
      
      if (result.alreadyExists) {
        return res.status(200).json({ 
          success: true, 
          message: 'Email already subscribed',
          alreadySubscribed: true
        });
      }

      // Send welcome email (don't fail subscription if email fails)
      let emailSent = false;
      try {
        const primaryColor = '#ff6b35'; // hsl(14 100% 55%)
        const primaryLight = '#ff8c5a';
        const background = '#f5f5f5';
        const cardBg = '#ffffff';
        const textColor = '#1a1a1a';
        const mutedColor = '#666666';
        const borderColor = '#e0e0e0';

        await resend.emails.send({
          from: 'Portfolio Blog <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to the Blog Newsletter! 🎉',
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Blog Newsletter</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: ${background}; font-family: 'Space Grotesk', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${background};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: ${cardBg}; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryLight} 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -1px; line-height: 1.2;">Welcome! 🎉</h1>
                    <p style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255, 255, 255, 0.8); text-transform: uppercase; letter-spacing: 2px; margin: 15px 0 0 0;">YOU'RE SUBSCRIBED</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="color: ${textColor}; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.3;">
                      Thank you for subscribing!
                    </h2>
                    <p style="color: ${textColor}; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      I'm excited to have you on board! You'll now receive notifications whenever I publish new articles on my blog.
                    </p>
                    <p style="color: ${mutedColor}; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                      Stay tuned for technical deep-dives, design explorations, and lessons learned from building digital experiences.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Preview Section Placeholder -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${background}; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="color: ${mutedColor}; font-size: 12px; margin: 0; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 1px;">
                      Future blog posts will appear here
                    </p>
                    <p style="color: ${mutedColor}; font-size: 11px; margin: 10px 0 0 0;">
                      With preview images, titles, and summaries
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <h3 style="color: ${textColor}; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">What to expect:</h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="color: ${textColor}; font-size: 14px; margin: 0; line-height: 1.6;">
                            📧 <strong>New article notifications</strong> - Get notified when I publish new content
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="color: ${textColor}; font-size: 14px; margin: 0; line-height: 1.6;">
                            🖼️ <strong>Rich previews</strong> - See article thumbnails and summaries
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="color: ${textColor}; font-size: 14px; margin: 0; line-height: 1.6;">
                            🎯 <strong>Direct links</strong> - Quick access to read full articles
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top: 1px solid ${borderColor}; padding: 30px 30px 20px 30px;">
              <p style="color: ${mutedColor}; font-size: 12px; margin: 0; text-align: center; font-family: 'JetBrains Mono', monospace;">
                You can unsubscribe at any time by replying to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${background}; padding: 20px 30px; text-align: center; border-top: 1px solid ${borderColor};">
              <p style="color: ${mutedColor}; font-size: 11px; margin: 0; font-family: 'JetBrains Mono', monospace;">
                Portfolio Blog Newsletter
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });
        emailSent = true;
        console.log('Welcome email sent successfully to:', email);
      } catch (emailError: any) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the subscription if welcome email fails, but log it
        console.error('Email error details:', {
          message: emailError?.message,
          name: emailError?.name,
          stack: emailError?.stack
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to blog notifications',
        welcomeEmailSent: emailSent
      });

    } catch (error: any) {
      console.error('Error subscribing email:', error);
      return res.status(500).json({ 
        error: 'Internal server error', 
        details: error.message 
      });
    }
  }

    return res.status(405).json({ error: 'Method not allowed', method: req.method });
  } catch (error: any) {
    console.error('Unhandled error in subscribe handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}

