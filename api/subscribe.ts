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

      // Send welcome email (optional)
      try {
        await resend.emails.send({
          from: 'Portfolio Blog <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to the Blog Newsletter! 🎉',
          html: `
            <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">You're subscribed!</h1>
              </div>
              <div style="padding: 40px; background: #f5f5f5;">
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Thanks for subscribing to my blog newsletter! You'll now receive notifications whenever I publish new articles.
                </p>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
                  Stay tuned for technical deep-dives, design explorations, and lessons learned from building digital experiences.
                </p>
              </div>
              <div style="padding: 20px; background: #ffffff; border-radius: 0 0 16px 16px; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 12px; margin: 0; text-align: center; font-family: 'JetBrains Mono', monospace;">
                  You can unsubscribe at any time by replying to this email.
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the subscription if welcome email fails
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to blog notifications'
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

