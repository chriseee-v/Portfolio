import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSubscriptions } from './supabase-storage.js';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Email template matching portfolio design
function createBlogNotificationEmail(blogPost: {
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
  url?: string;
}): string {
  const primaryColor = '#ff6b35'; // hsl(14 100% 55%)
  const primaryLight = '#ff8c5a';
  const background = '#f5f5f5';
  const cardBg = '#ffffff';
  const textColor = '#1a1a1a';
  const mutedColor = '#666666';
  const borderColor = '#e0e0e0';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Blog Post: ${blogPost.title}</title>
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
                    <p style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255, 255, 255, 0.8); text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">NEW ARTICLE</p>
                    <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -1px; line-height: 1.2;">New Blog Post Published</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                
                <!-- Blog Title -->
                <tr>
                  <td>
                    <h2 style="color: ${textColor}; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.3;">
                      ${blogPost.title}
                    </h2>
                  </td>
                </tr>

                <!-- Meta Info -->
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-right: 20px;">
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${mutedColor}; margin: 0;">
                            📅 ${blogPost.date}
                          </p>
                        </td>
                        <td>
                          <p style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${mutedColor}; margin: 0;">
                            ⏱️ ${blogPost.readTime} read
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Summary -->
                <tr>
                  <td style="padding-bottom: 25px;">
                    <p style="color: ${mutedColor}; font-size: 16px; line-height: 1.6; margin: 0;">
                      ${blogPost.summary}
                    </p>
                  </td>
                </tr>

                <!-- Tags -->
                <tr>
                  <td style="padding-bottom: 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          ${blogPost.tags.map(tag => `
                            <span style="display: inline-block; padding: 6px 12px; margin: 0 6px 6px 0; background-color: ${background}; color: ${textColor}; border-radius: 20px; font-size: 11px; font-family: 'JetBrains Mono', monospace; border: 1px solid ${borderColor};">
                              ${tag}
                            </span>
                          `).join('')}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                ${blogPost.url ? `
                <tr>
                  <td style="padding-bottom: 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${blogPost.url}" style="display: inline-block; background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryLight} 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 500; font-size: 14px; box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);">
                            Read Article →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}

                <!-- Divider -->
                <tr>
                  <td style="border-top: 1px solid ${borderColor}; padding-top: 30px;">
                    <p style="color: ${mutedColor}; font-size: 12px; margin: 0; text-align: center; font-family: 'JetBrains Mono', monospace;">
                      You're receiving this because you subscribed to blog notifications.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${background}; padding: 30px; text-align: center; border-top: 1px solid ${borderColor};">
              <p style="color: ${mutedColor}; font-size: 12px; margin: 0 0 10px 0; font-family: 'JetBrains Mono', monospace;">
                Portfolio Blog Newsletter
              </p>
              <p style="color: ${mutedColor}; font-size: 11px; margin: 0;">
                To unsubscribe, reply to this email with "unsubscribe"
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Wrap everything in try-catch to handle any errors
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).json({});
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

  // Optional: Add API key protection for this endpoint
  const apiKey = req.headers['x-api-key'] || req.body?.apiKey;
  const expectedApiKey = process.env.BLOG_NOTIFICATION_API_KEY;
  
  if (expectedApiKey && apiKey !== expectedApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { blogPost } = req.body;

    // Validate blog post data
    if (!blogPost || !blogPost.title || !blogPost.summary) {
      return res.status(400).json({ error: 'Invalid blog post data. Title and summary are required.' });
    }

    // Get all subscribers
    const subscriptions = await getSubscriptions();
    
    if (subscriptions.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No subscribers to notify',
        sent: 0
      });
    }

    // Create email HTML
    const emailHtml = createBlogNotificationEmail(blogPost);

    // Send emails to all subscribers
    const emailAddresses = subscriptions.map(s => s.email);
    const batchSize = 50; // Resend allows up to 50 recipients per email
    
    let sentCount = 0;
    let errors: any[] = [];

    // Send in batches
    for (let i = 0; i < emailAddresses.length; i += batchSize) {
      const batch = emailAddresses.slice(i, i + batchSize);
      
      try {
        const { data, error } = await resend.emails.send({
          from: 'Portfolio Blog <onboarding@resend.dev>',
          to: batch,
          subject: `New Article: ${blogPost.title}`,
          html: emailHtml,
        });

        if (error) {
          console.error('Resend error:', error);
          errors.push(error);
        } else {
          sentCount += batch.length;
        }
      } catch (error: any) {
        console.error('Error sending batch:', error);
        errors.push(error);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Notifications sent to ${sentCount} subscribers`,
      sent: sentCount,
      total: subscriptions.length,
      errors: errors.length > 0 ? errors : undefined
    });

    } catch (error: any) {
      console.error('Error sending blog notifications:', error);
      return res.status(500).json({ 
        error: 'Internal server error', 
        details: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      });
    }
  } catch (error: any) {
    // Top-level error handler
    console.error('Unhandled error in send-blog-notification handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}

