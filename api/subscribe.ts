import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSubscriptions, saveSubscription } from './supabase-storage.js';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

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
    const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const storageType = hasSupabase ? 'Supabase' : 'In-Memory (temporary)';
    
    console.log(`📋 [GET] Fetching subscriptions from ${storageType}...`);
    const subscriptions = await getSubscriptions();
    console.log(`📋 [GET] Found ${subscriptions.length} subscriptions`);
    console.log(`📋 [GET] Storage: ${storageType}`);
    
    if (hasSupabase) {
      console.log('📋 [GET] Database: Supabase');
      console.log('📋 [GET] Table: blog_subscriptions');
    } else {
      console.warn('⚠️  [GET] Using temporary in-memory storage');
      console.warn('⚠️  [GET] Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for persistent storage');
    }
    
    return res.status(200).json({ 
      count: subscriptions.length,
      subscriptions: subscriptions.map(s => ({ 
        email: s.email, 
        subscribedAt: s.subscribedAt,
        verified: s.verified
      })),
      storage: storageType
    });
  }

  // POST - Subscribe email
  if (req.method === 'POST') {
    console.log('📧 [SUBSCRIBE] POST request received');
    try {
      const { email } = req.body;
      console.log('📧 [SUBSCRIBE] Request body:', { email: email ? `${email.substring(0, 3)}***` : 'missing' });

      // Validate email
      if (!email) {
        console.log('❌ [SUBSCRIBE] Email is missing');
        return res.status(400).json({ error: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('❌ [SUBSCRIBE] Invalid email format:', email);
        return res.status(400).json({ error: 'Invalid email address' });
      }
      console.log('✅ [SUBSCRIBE] Email format validated:', email);

      // Check Resend configuration
      console.log('🔍 [SUBSCRIBE] Checking Resend configuration...');
      console.log('🔍 [SUBSCRIBE] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
      console.log('🔍 [SUBSCRIBE] Resend instance:', resend ? 'initialized' : 'not initialized');

      // Add subscription to Supabase (handles duplicate check)
      console.log('💾 [SUBSCRIBE] Saving subscription to Supabase database...');
      console.log('💾 [SUBSCRIBE] Database: Supabase');
      console.log('💾 [SUBSCRIBE] Table: blog_subscriptions');
      console.log('💾 [SUBSCRIBE] Email to save:', email);
      
      const result = await saveSubscription(email);
      console.log('💾 [SUBSCRIBE] Subscription result:', result);
      
      if (result.alreadyExists) {
        console.log('ℹ️  [SUBSCRIBE] Email already exists, skipping welcome email');
        return res.status(200).json({ 
          success: true, 
          message: 'Email already subscribed',
          alreadySubscribed: true
        });
      }
      console.log('✅ [SUBSCRIBE] New subscription added successfully');

      // Send welcome email (don't fail subscription if email fails)
      let emailSent = false;
      console.log('📬 [SUBSCRIBE] Preparing to send welcome email...');
      
      try {
        const primaryColor = '#ff6b35'; // hsl(14 100% 55%)
        const primaryLight = '#ff8c5a';
        const background = '#f5f5f5';
        const cardBg = '#ffffff';
        const textColor = '#1a1a1a';
        const mutedColor = '#666666';
        const borderColor = '#e0e0e0';

        console.log('📬 [SUBSCRIBE] Building email template...');
        const emailHtml = `
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
          `;
        
        console.log('📬 [SUBSCRIBE] Email template built, length:', emailHtml.length);
        console.log('📬 [SUBSCRIBE] Attempting to send email via Resend...');
        console.log('📬 [SUBSCRIBE] Email details:', {
          from: 'Portfolio Blog <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to the Blog Newsletter! 🎉',
          htmlLength: emailHtml.length
        });

        const emailResult = await resend.emails.send({
          from: 'Portfolio Blog <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to the Blog Newsletter! 🎉',
          html: emailHtml,
        });

        console.log('📬 [SUBSCRIBE] Resend API response received');
        console.log('📬 [SUBSCRIBE] Full email result:', JSON.stringify({
          hasData: !!emailResult.data,
          hasError: !!emailResult.error,
          dataId: emailResult.data?.id,
          errorType: emailResult.error?.name,
          errorMessage: emailResult.error?.message
        }, null, 2));

        if (emailResult.error) {
          console.error('❌ [SUBSCRIBE] Resend API returned an error');
          console.error('❌ [SUBSCRIBE] Error details:', JSON.stringify(emailResult.error, null, 2));
          throw new Error(emailResult.error.message || 'Resend API returned an error');
        }

        if (!emailResult.data) {
          console.error('❌ [SUBSCRIBE] Resend API returned no data');
          throw new Error('Resend API returned no data');
        }

        emailSent = true;
        console.log('✅ [SUBSCRIBE] Welcome email sent successfully!');
        console.log('✅ [SUBSCRIBE] Email ID:', emailResult.data.id);
        console.log('✅ [SUBSCRIBE] Recipient:', email);
      } catch (emailError: any) {
        emailSent = false;
        console.error('❌ [SUBSCRIBE] Error sending welcome email');
        console.error('❌ [SUBSCRIBE] Error type:', emailError?.constructor?.name);
        console.error('❌ [SUBSCRIBE] Error message:', emailError?.message);
        console.error('❌ [SUBSCRIBE] Error name:', emailError?.name);
        console.error('❌ [SUBSCRIBE] Error code:', emailError?.code);
        if (emailError?.stack) {
          console.error('❌ [SUBSCRIBE] Error stack:', emailError.stack);
        }
        // Don't fail the subscription if welcome email fails, but log it
      }

      console.log('✅ [SUBSCRIBE] Subscription process completed');
      console.log('✅ [SUBSCRIBE] Final status:', { emailSent, email });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to blog notifications',
        welcomeEmailSent: emailSent
      });

    } catch (error: any) {
      console.error('❌ [SUBSCRIBE] Unhandled error in subscribe handler');
      console.error('❌ [SUBSCRIBE] Error type:', error?.constructor?.name);
      console.error('❌ [SUBSCRIBE] Error message:', error?.message);
      console.error('❌ [SUBSCRIBE] Error name:', error?.name);
      console.error('❌ [SUBSCRIBE] Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      if (error?.stack) {
        console.error('❌ [SUBSCRIBE] Error stack:', error.stack);
      }
      
      // Return detailed error for debugging
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error', 
        message: error?.message || 'Unknown error',
        type: error?.constructor?.name,
        details: process.env.NODE_ENV === 'development' ? {
          name: error?.name,
          message: error?.message,
          stack: error?.stack
        } : undefined
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

