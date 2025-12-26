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

# Show repository info
REPO_URL=$(git remote get-url origin 2>/dev/null | sed 's/\.git$//' | sed 's/^.*@github\.com:/https:\/\/github.com\//' | sed 's/^https:\/\/[^@]*@/https:\/\//')
if [ -n "$REPO_URL" ]; then
    echo -e "${BLUE}🔗 Repository: ${GREEN}$REPO_URL${NC}"
fi
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
    PUSH_OUTPUT=$(git push origin "$CURRENT_BRANCH" 2>&1)
    push_exit_code=$?
    
    # Check if push was successful
    if [ $push_exit_code -eq 0 ]; then
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✅ Successfully pushed to GitHub!  ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
        
        # Show repository URL
        REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's/^.*@github\.com:/https:\/\/github.com\//' | sed 's/^https:\/\/[^@]*@/https:\/\//')
        echo -e "${BLUE}🔗 Repository: ${GREEN}$REPO_URL${NC}"
    else
        echo ""
        echo -e "${RED}╔════════════════════════════════════╗${NC}"
        echo -e "${RED}║  ❌ Push failed                    ║${NC}"
        echo -e "${RED}╚════════════════════════════════════╝${NC}"
        
        # Check for common errors
        if echo "$PUSH_OUTPUT" | grep -q "Permission denied\|403\|Authentication failed"; then
            echo -e "${YELLOW}⚠️  Authentication failed.${NC}"
            echo -e "${YELLOW}💡 Tip: You may need to use a Personal Access Token.${NC}"
            echo -e "${YELLOW}   Create one at: https://github.com/settings/tokens${NC}"
            echo -e "${YELLOW}   When prompted, use your token as the password.${NC}"
        elif echo "$PUSH_OUTPUT" | grep -q "remote: Permission"; then
            echo -e "${YELLOW}⚠️  Permission denied to repository.${NC}"
            echo -e "${YELLOW}💡 Check if you have access to the repository.${NC}"
        else
            echo -e "${YELLOW}Error details:${NC}"
            echo "$PUSH_OUTPUT" | head -5
        fi
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Commit failed.${NC}"
    exit 1
fi

