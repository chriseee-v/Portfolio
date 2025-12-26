#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 Git Push Script            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo ""

# Check if there are any changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  No changes to commit.${NC}"
    exit 0
fi

# Show current status
echo -e "${BLUE}📋 Files changed:${NC}"
git status --short
echo ""

# Stage all changes
echo -e "${BLUE}📦 Staging all changes...${NC}"
git add -A

# Prompt for commit message
echo ""
echo -e "${YELLOW}💬 Enter your commit message:${NC}"
echo -e "${YELLOW}(Press Enter for default: 'Update files')${NC}"
read -r commit_message

# Check if commit message is empty
if [ -z "$commit_message" ]; then
    echo -e "${YELLOW}⚠️  Using default commit message.${NC}"
    commit_message="Update files"
fi

# Show what will be committed
echo ""
echo -e "${BLUE}📝 Commit message: ${GREEN}$commit_message${NC}"
echo -e "${BLUE}🌿 Branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo ""

# Ask for confirmation
echo -e "${YELLOW}❓ Proceed with commit and push? (y/n)${NC}"
read -r confirmation

if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Cancelled.${NC}"
    exit 0
fi

# Commit changes
echo ""
echo -e "${BLUE}💾 Committing changes...${NC}"
git commit -m "$commit_message"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes committed successfully!${NC}"
    echo ""
    
    # Push to GitHub
    echo -e "${BLUE}📤 Pushing to GitHub (origin/$CURRENT_BRANCH)...${NC}"
    git push origin "$CURRENT_BRANCH"
    
    # Check if push was successful
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✅ Successfully pushed to GitHub!  ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
    else
        echo ""
        echo -e "${RED}╔════════════════════════════════════╗${NC}"
        echo -e "${RED}║  ❌ Push failed                    ║${NC}"
        echo -e "${RED}╚════════════════════════════════════╝${NC}"
        echo -e "${YELLOW}Please check your Git configuration.${NC}"
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Commit failed.${NC}"
    exit 1
fi

