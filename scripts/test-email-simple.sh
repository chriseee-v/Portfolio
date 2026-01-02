#!/bin/bash

# Simple test script for email notifications
# Usage: ./scripts/test-email-simple.sh your-email@example.com

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get email from argument or use default
TEST_EMAIL=${1:-"test@example.com"}
API_URL=${API_BASE_URL:-"http://localhost:3000"}

echo -e "${CYAN}🚀 Blog Notification Email Test${NC}"
echo -e "${CYAN}================================${NC}\n"

echo -e "${BLUE}API URL: ${API_URL}${NC}"
echo -e "${BLUE}Test Email: ${TEST_EMAIL}${NC}\n"

# Test 1: Subscribe
echo -e "${CYAN}📧 Test 1: Subscribing email...${NC}"
SUBSCRIBE_RESPONSE=$(curl -s -X POST "${API_URL}/api/subscribe" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${TEST_EMAIL}\"}")

if echo "$SUBSCRIBE_RESPONSE" | grep -q "success"; then
  echo -e "${GREEN}✅ Subscription successful!${NC}"
else
  echo -e "${RED}❌ Subscription failed!${NC}"
  echo "$SUBSCRIBE_RESPONSE"
fi

echo ""

# Test 2: Check subscribers
echo -e "${CYAN}👥 Test 2: Checking subscribers...${NC}"
SUBSCRIBERS_RESPONSE=$(curl -s -X GET "${API_URL}/api/subscribe")

if echo "$SUBSCRIBERS_RESPONSE" | grep -q "count"; then
  COUNT=$(echo "$SUBSCRIBERS_RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
  echo -e "${GREEN}✅ Found ${COUNT} subscriber(s)${NC}"
else
  echo -e "${YELLOW}⚠️  Could not get subscriber count${NC}"
fi

echo ""

# Test 3: Send notification
echo -e "${CYAN}📬 Test 3: Sending test notification...${NC}"

NOTIFICATION_BODY=$(cat <<EOF
{
  "blogPost": {
    "title": "Test Blog Post - Email Notification System",
    "date": "$(date +"%b %d, %Y")",
    "readTime": "3 min",
    "tags": ["Testing", "Email", "Notifications"],
    "summary": "This is a test email to verify that the blog notification system is working correctly. If you receive this email, the system is functioning properly!",
    "url": "https://example.com/test-post"
  }
}
EOF
)

NOTIFICATION_RESPONSE=$(curl -s -X POST "${API_URL}/api/send-blog-notification" \
  -H "Content-Type: application/json" \
  -d "$NOTIFICATION_BODY")

if echo "$NOTIFICATION_RESPONSE" | grep -q "success"; then
  SENT=$(echo "$NOTIFICATION_RESPONSE" | grep -o '"sent":[0-9]*' | grep -o '[0-9]*')
  TOTAL=$(echo "$NOTIFICATION_RESPONSE" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
  echo -e "${GREEN}✅ Notification sent successfully!${NC}"
  echo -e "${GREEN}   Sent to: ${SENT} subscriber(s)${NC}"
  echo -e "${GREEN}   Total subscribers: ${TOTAL}${NC}"
  echo ""
  echo -e "${YELLOW}📬 Check your inbox at: ${TEST_EMAIL}${NC}"
  echo -e "${YELLOW}   (Also check spam folder if not in inbox)${NC}"
else
  echo -e "${RED}❌ Notification failed!${NC}"
  echo "$NOTIFICATION_RESPONSE"
fi

echo ""
echo -e "${CYAN}✨ Test completed!${NC}"

