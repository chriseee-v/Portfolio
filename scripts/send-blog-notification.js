#!/usr/bin/env node

/**
 * Script to send blog notifications to all subscribers
 * 
 * Usage:
 *   node scripts/send-blog-notification.js
 * 
 * Or with a specific blog post:
 *   node scripts/send-blog-notification.js --title "My New Post" --url "https://..."
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const titleIndex = args.indexOf('--title');
const urlIndex = args.indexOf('--url');
const dateIndex = args.indexOf('--date');
const readTimeIndex = args.indexOf('--read-time');
const tagsIndex = args.indexOf('--tags');
const summaryIndex = args.indexOf('--summary');

// Get API endpoint from environment or use default
const API_URL = process.env.BLOG_NOTIFICATION_API_URL || 'http://localhost:3000/api/send-blog-notification';
const API_KEY = process.env.BLOG_NOTIFICATION_API_KEY || '';

// Function to get latest blog post from blogs.json
function getLatestBlogPost() {
  try {
    const blogsPath = join(__dirname, '../src/data/blogs.json');
    const blogsData = JSON.parse(readFileSync(blogsPath, 'utf-8'));
    
    if (blogsData.length === 0) {
      throw new Error('No blog posts found in blogs.json');
    }
    
    // Return the first post (assuming it's the latest)
    // Or sort by date if you have date fields
    return blogsData[0];
  } catch (error) {
    console.error('Error reading blogs.json:', error.message);
    return null;
  }
}

// Function to send notification
async function sendNotification(blogPost) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ blogPost }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send notification');
    }
    
    console.log('✅ Success!');
    console.log(`📧 Sent to ${data.sent} subscribers`);
    console.log(`📊 Total subscribers: ${data.total}`);
    
    if (data.errors && data.errors.length > 0) {
      console.warn('⚠️  Some errors occurred:', data.errors);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error sending notification:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  let blogPost;
  
  // If specific arguments provided, use them
  if (titleIndex !== -1) {
    blogPost = {
      title: args[titleIndex + 1],
      date: dateIndex !== -1 ? args[dateIndex + 1] : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: readTimeIndex !== -1 ? args[readTimeIndex + 1] : '5 min',
      tags: tagsIndex !== -1 ? args[tagsIndex + 1].split(',') : [],
      summary: summaryIndex !== -1 ? args[summaryIndex + 1] : '',
      url: urlIndex !== -1 ? args[urlIndex + 1] : undefined,
    };
  } else {
    // Otherwise, get latest from blogs.json
    console.log('📖 Reading latest blog post from blogs.json...');
    blogPost = getLatestBlogPost();
    
    if (!blogPost) {
      console.error('❌ Could not find blog post. Please provide blog post details or ensure blogs.json exists.');
      console.log('\nUsage:');
      console.log('  node scripts/send-blog-notification.js');
      console.log('  node scripts/send-blog-notification.js --title "My Post" --url "https://..." --date "Jan 1, 2025" --read-time "5 min" --tags "React,TypeScript" --summary "Post summary"');
      process.exit(1);
    }
  }
  
  // Validate required fields
  if (!blogPost.title || !blogPost.summary) {
    console.error('❌ Blog post must have at least title and summary');
    process.exit(1);
  }
  
  console.log('\n📝 Blog Post Details:');
  console.log(`   Title: ${blogPost.title}`);
  console.log(`   Date: ${blogPost.date}`);
  console.log(`   Read Time: ${blogPost.readTime}`);
  console.log(`   Tags: ${blogPost.tags.join(', ')}`);
  console.log(`   URL: ${blogPost.url || 'N/A'}`);
  console.log(`\n🚀 Sending notification to all subscribers...\n`);
  
  await sendNotification(blogPost);
}

main();

