#!/usr/bin/env node

/**
 * Test script for blog notification email system
 * 
 * Usage:
 *   node scripts/test-email.js
 * 
 * This script will:
 * 1. Test subscription endpoint
 * 2. Test sending a notification email
 * 3. Show you the results
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testSubscription(email) {
  logSection('📧 Testing Subscription Endpoint');
  
  try {
    log(`Subscribing email: ${email}`, 'blue');
    
    const response = await fetch(`${API_BASE_URL}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      log('✅ Subscription successful!', 'green');
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.alreadySubscribed) {
        log('ℹ️  Email was already subscribed', 'yellow');
      } else {
        log('✅ New subscription created', 'green');
      }
      
      return { success: true, data };
    } else {
      log('❌ Subscription failed!', 'red');
      console.log('Error:', data.error || data.message);
      return { success: false, error: data };
    }
  } catch (error) {
    log('❌ Error testing subscription:', 'red');
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

async function testNotification(email) {
  logSection('📬 Testing Notification Endpoint');
  
  // Sample blog post for testing
  const testBlogPost = {
    title: "Test Blog Post - Email Notification System",
    date: new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    readTime: "3 min",
    tags: ["Testing", "Email", "Notifications"],
    summary: "This is a test email to verify that the blog notification system is working correctly. If you receive this email, the system is functioning properly!",
    url: "https://example.com/test-post"
  };

  try {
    log('Sending test notification...', 'blue');
    console.log('Blog Post:', JSON.stringify(testBlogPost, null, 2));
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API key if provided
    const apiKey = process.env.BLOG_NOTIFICATION_API_KEY;
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/send-blog-notification`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ blogPost: testBlogPost }),
    });

    const data = await response.json();

    if (response.ok) {
      log('✅ Notification sent successfully!', 'green');
      console.log('\nResults:');
      console.log(`  📧 Sent to: ${data.sent} subscribers`);
      console.log(`  📊 Total subscribers: ${data.total}`);
      
      if (data.errors && data.errors.length > 0) {
        log('⚠️  Some errors occurred:', 'yellow');
        console.log(data.errors);
      }
      
      log(`\n✅ Check your inbox at: ${email}`, 'green');
      log('   (Also check spam folder if not in inbox)', 'yellow');
      
      return { success: true, data };
    } else {
      log('❌ Notification failed!', 'red');
      console.log('Error:', data.error || data.message);
      return { success: false, error: data };
    }
  } catch (error) {
    log('❌ Error testing notification:', 'red');
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

async function checkSubscribers() {
  logSection('👥 Checking Subscribers');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscribe`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      log(`✅ Total subscribers: ${data.count}`, 'green');
      
      if (data.subscriptions && data.subscriptions.length > 0) {
        console.log('\nSubscribers:');
        data.subscriptions.forEach((sub, index) => {
          console.log(`  ${index + 1}. ${sub.email} (subscribed: ${sub.subscribedAt})`);
        });
      } else {
        log('ℹ️  No subscribers yet', 'yellow');
      }
      
      return { success: true, data };
    } else {
      log('❌ Failed to get subscribers', 'red');
      console.log('Error:', data.error || data.message);
      return { success: false, error: data };
    }
  } catch (error) {
    log('❌ Error checking subscribers:', 'red');
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('\n');
  log('🚀 Blog Notification Email Test Script', 'cyan');
  log('==========================================\n', 'cyan');
  
  // Get test email from command line or use default
  const args = process.argv.slice(2);
  const emailIndex = args.indexOf('--email');
  const testEmail = emailIndex !== -1 && args[emailIndex + 1] 
    ? args[emailIndex + 1] 
    : TEST_EMAIL;
  
  // Check if we should skip subscription
  const skipSubscribe = args.includes('--skip-subscribe');
  const skipNotification = args.includes('--skip-notification');
  const onlyCheck = args.includes('--check-only');
  
  log(`API Base URL: ${API_BASE_URL}`, 'blue');
  log(`Test Email: ${testEmail}`, 'blue');
  console.log('');
  
  const results = {
    subscription: null,
    notification: null,
    subscribers: null,
  };
  
  // Check subscribers first
  if (!onlyCheck) {
    results.subscribers = await checkSubscribers();
  }
  
  // Test subscription
  if (!skipSubscribe && !onlyCheck) {
    results.subscription = await testSubscription(testEmail);
    
    // Wait a bit before checking subscribers again
    if (results.subscription.success) {
      log('\n⏳ Waiting 2 seconds...', 'yellow');
      await new Promise(resolve => setTimeout(resolve, 2000));
      results.subscribers = await checkSubscribers();
    }
  }
  
  // Test notification
  if (!skipNotification && !onlyCheck) {
    results.notification = await testNotification(testEmail);
  }
  
  // Summary
  logSection('📊 Test Summary');
  
  if (results.subscribers) {
    if (results.subscribers.success) {
      log(`✅ Subscribers check: PASSED (${results.subscribers.data.count} subscribers)`, 'green');
    } else {
      log('❌ Subscribers check: FAILED', 'red');
    }
  }
  
  if (results.subscription) {
    if (results.subscription.success) {
      log('✅ Subscription test: PASSED', 'green');
    } else {
      log('❌ Subscription test: FAILED', 'red');
    }
  }
  
  if (results.notification) {
    if (results.notification.success) {
      log('✅ Notification test: PASSED', 'green');
      log('\n📬 Next Steps:', 'cyan');
      log('   1. Check your email inbox', 'blue');
      log('   2. Check spam folder if not found', 'blue');
      log('   3. Verify email design matches your portfolio', 'blue');
      log('   4. Test on different email clients (Gmail, Outlook, etc.)', 'blue');
    } else {
      log('❌ Notification test: FAILED', 'red');
      log('\n💡 Troubleshooting:', 'yellow');
      log('   1. Check RESEND_API_KEY is set in environment', 'blue');
      log('   2. Verify API endpoint is accessible', 'blue');
      log('   3. Check Vercel function logs for errors', 'blue');
    }
  }
  
  console.log('\n');
  log('✨ Test completed!', 'cyan');
  console.log('\n');
  
  // Exit with error code if any test failed
  const allPassed = 
    (!results.subscription || results.subscription.success) &&
    (!results.notification || results.notification.success) &&
    (!results.subscribers || results.subscribers.success);
  
  process.exit(allPassed ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log('❌ Unhandled error:', 'red');
  console.error(error);
  process.exit(1);
});

main();

