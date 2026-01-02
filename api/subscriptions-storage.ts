/**
 * Simple storage helper for subscriptions
 * 
 * For production, replace this with:
 * - Vercel KV
 * - Supabase
 * - MongoDB
 * - PostgreSQL
 * - Or any other database
 */

interface Subscription {
  email: string;
  subscribedAt: string;
  verified: boolean;
}

// Simple in-memory storage with optional external sync
let subscriptionsCache: Subscription[] | null = null;
let lastSyncTime = 0;
const SYNC_INTERVAL = 60000; // Sync every minute

/**
 * Get subscriptions from cache or external storage
 */
export async function getSubscriptions(): Promise<Subscription[]> {
  const now = Date.now();
  
  // If cache is fresh, return it
  if (subscriptionsCache && (now - lastSyncTime) < SYNC_INTERVAL) {
    return subscriptionsCache;
  }
  
  // Try to fetch from external storage
  const storageUrl = process.env.SUBSCRIPTIONS_STORAGE_URL;
  
  if (storageUrl) {
    try {
      const response = await fetch(storageUrl, {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store' // Don't cache in serverless functions
      });
      
      if (response.ok) {
        const data = await response.json();
        subscriptionsCache = Array.isArray(data) ? data : [];
        lastSyncTime = now;
        return subscriptionsCache;
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      // Fall back to cache if available
    }
  }
  
  // Return cache or empty array
  return subscriptionsCache || [];
}

/**
 * Save subscriptions to cache and external storage
 */
export async function saveSubscriptions(subscriptions: Subscription[]): Promise<void> {
  // Update cache
  subscriptionsCache = subscriptions;
  lastSyncTime = Date.now();
  
  // Try to save to external storage
  const storageUrl = process.env.SUBSCRIPTIONS_STORAGE_URL;
  const storageApiKey = process.env.SUBSCRIPTIONS_STORAGE_API_KEY;
  
  if (storageUrl && storageApiKey) {
    try {
      const response = await fetch(storageUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storageApiKey}`,
        },
        body: JSON.stringify(subscriptions),
      });
      
      if (!response.ok) {
        console.error('Error saving to storage:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving subscriptions:', error);
      // Continue - at least we have cache
    }
  }
  
  // If no external storage, log a warning
  if (!storageUrl) {
    console.warn('⚠️  No SUBSCRIPTIONS_STORAGE_URL set. Subscriptions will only persist in memory.');
    console.warn('⚠️  For production, set up Vercel KV, Supabase, or another database.');
  }
}

/**
 * Add a new subscription
 */
export async function addSubscription(email: string): Promise<{ success: boolean; alreadyExists: boolean }> {
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

/**
 * Remove a subscription (unsubscribe)
 */
export async function removeSubscription(email: string): Promise<boolean> {
  const subscriptions = await getSubscriptions();
  const normalizedEmail = email.toLowerCase().trim();
  
  const filtered = subscriptions.filter(s => s.email !== normalizedEmail);
  
  if (filtered.length === subscriptions.length) {
    return false; // Not found
  }
  
  await saveSubscriptions(filtered);
  return true;
}

