/**
 * Supabase storage for blog subscriptions
 * 
 * This module handles storing and retrieving email subscriptions from Supabase.
 */

import { createClient } from '@supabase/supabase-js';

export interface Subscription {
  email: string;
  subscribedAt: string;
  verified: boolean;
}

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  [SUPABASE] Supabase credentials not configured');
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get all subscriptions from Supabase
 */
export async function getSubscriptions(): Promise<Subscription[]> {
  console.log('💾 [SUPABASE] Fetching subscriptions from database...');
  
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('⚠️  [SUPABASE] Supabase not configured, returning empty array');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_subscriptions')
      .select('email, subscribed_at, verified')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('❌ [SUPABASE] Error fetching subscriptions:', error);
      throw error;
    }

    console.log('✅ [SUPABASE] Successfully fetched', data?.length || 0, 'subscriptions');
    if (data && data.length > 0) {
      console.log('📧 [SUPABASE] Email list:', data.map(s => s.email).join(', '));
    }

    const mapped = (data || []).map(sub => ({
      email: sub.email,
      subscribedAt: sub.subscribed_at,
      verified: sub.verified || true,
    }));
    
    return mapped as Subscription[];
  } catch (error: any) {
    console.error('❌ [SUPABASE] Failed to fetch subscriptions:', error.message);
    return [];
  }
}

/**
 * Save a subscription to Supabase
 */
export async function saveSubscription(email: string): Promise<{ success: boolean; alreadyExists: boolean }> {
  console.log('💾 [SUPABASE] Saving subscription for:', email);
  
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('❌ [SUPABASE] Supabase not configured, cannot save subscription');
    throw new Error('Supabase not configured');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  try {
    // Check if email already exists
    console.log('🔍 [SUPABASE] Checking if email already exists...');
    const { data: existing, error: checkError } = await supabase
      .from('blog_subscriptions')
      .select('email')
      .eq('email', normalizedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ [SUPABASE] Error checking existing subscription:', checkError);
      throw checkError;
    }

    if (existing) {
      console.log('ℹ️  [SUPABASE] Email already exists in database:', normalizedEmail);
      return { success: true, alreadyExists: true };
    }

    // Insert new subscription
    console.log('➕ [SUPABASE] Inserting new subscription...');
    const { data, error } = await supabase
      .from('blog_subscriptions')
      .insert([
        {
          email: normalizedEmail,
          subscribed_at: now,
          verified: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ [SUPABASE] Error inserting subscription:', error);
      throw error;
    }

    console.log('✅ [SUPABASE] Successfully saved subscription to database');
    console.log('✅ [SUPABASE] Subscription ID:', data?.id);
    console.log('✅ [SUPABASE] Email saved:', normalizedEmail);
    console.log('✅ [SUPABASE] Saved at:', now);

    return { success: true, alreadyExists: false };
  } catch (error: any) {
    console.error('❌ [SUPABASE] Failed to save subscription:', error.message);
    throw error;
  }
}

/**
 * Remove a subscription (unsubscribe)
 */
export async function removeSubscription(email: string): Promise<boolean> {
  console.log('🗑️  [SUPABASE] Removing subscription for:', email);
  
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('❌ [SUPABASE] Supabase not configured, cannot remove subscription');
    return false;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const { error } = await supabase
      .from('blog_subscriptions')
      .delete()
      .eq('email', normalizedEmail);

    if (error) {
      console.error('❌ [SUPABASE] Error removing subscription:', error);
      return false;
    }

    console.log('✅ [SUPABASE] Successfully removed subscription:', normalizedEmail);
    return true;
  } catch (error: any) {
    console.error('❌ [SUPABASE] Failed to remove subscription:', error.message);
    return false;
  }
}

/**
 * Get subscription count
 */
export async function getSubscriptionCount(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 0;
  }

  try {
    const { count, error } = await supabase
      .from('blog_subscriptions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ [SUPABASE] Error counting subscriptions:', error);
      return 0;
    }

    return count || 0;
  } catch (error: any) {
    console.error('❌ [SUPABASE] Failed to count subscriptions:', error.message);
    return 0;
  }
}

