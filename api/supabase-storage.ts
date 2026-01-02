/**
 * Supabase storage for blog subscriptions
 * 
 * Setup:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Create a table called 'blog_subscriptions' with:
 *    - email (text, primary key)
 *    - subscribed_at (timestamp, default now())
 *    - verified (boolean, default true)
 * 3. Add environment variables:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY (for server-side operations)
 */

interface Subscription {
  email: string;
  subscribedAt: string;
  verified: boolean;
}

// Simple fetch-based Supabase client (no SDK needed)
async function supabaseRequest(endpoint: string, method: string = 'GET', body?: any) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const headers: Record<string, string> = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  return await response.json();
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase is not configured, return empty array
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase not configured, using in-memory storage');
    return [];
  }

  try {
    console.log('📊 [SUPABASE] Fetching subscriptions from database...');
    const data = await supabaseRequest('blog_subscriptions?select=email,subscribed_at,verified&order=subscribed_at.desc');
    
    if (!data) {
      return [];
    }

    const subscriptions: Subscription[] = Array.isArray(data) ? data.map((item: any) => ({
      email: item.email,
      subscribedAt: item.subscribed_at || item.subscribedAt,
      verified: item.verified !== false
    })) : [];

    console.log(`✅ [SUPABASE] Found ${subscriptions.length} subscriptions`);
    return subscriptions;
  } catch (error: any) {
    console.error('❌ [SUPABASE] Error fetching subscriptions:', error.message);
    throw error;
  }
}

export async function saveSubscription(email: string): Promise<{ success: boolean; alreadyExists: boolean }> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase is not configured, throw error
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if email already exists
    console.log('🔍 [SUPABASE] Checking if email exists:', normalizedEmail);
    const existing = await supabaseRequest(`blog_subscriptions?email=eq.${encodeURIComponent(normalizedEmail)}&select=email`);
    
    if (existing && Array.isArray(existing) && existing.length > 0) {
      console.log('ℹ️  [SUPABASE] Email already exists');
      return { success: true, alreadyExists: true };
    }

    // Insert new subscription
    console.log('💾 [SUPABASE] Inserting new subscription:', normalizedEmail);
    const newSubscription = {
      email: normalizedEmail,
      subscribed_at: new Date().toISOString(),
      verified: true
    };

    await supabaseRequest('blog_subscriptions', 'POST', newSubscription);
    console.log('✅ [SUPABASE] Subscription saved successfully');
    
    return { success: true, alreadyExists: false };
  } catch (error: any) {
    // Check if it's a unique constraint violation (email already exists)
    if (error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
      console.log('ℹ️  [SUPABASE] Email already exists (caught by constraint)');
      return { success: true, alreadyExists: true };
    }
    
    console.error('❌ [SUPABASE] Error saving subscription:', error.message);
    throw error;
  }
}

export async function removeSubscription(email: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase not configured');
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log('🗑️  [SUPABASE] Removing subscription:', normalizedEmail);
    
    const result = await supabaseRequest(`blog_subscriptions?email=eq.${encodeURIComponent(normalizedEmail)}`, 'DELETE');
    console.log('✅ [SUPABASE] Subscription removed');
    
    return true;
  } catch (error: any) {
    console.error('❌ [SUPABASE] Error removing subscription:', error.message);
    throw error;
  }
}

