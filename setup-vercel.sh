#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Vercel Auto-Deploy Setup        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Step 1: Login
echo -e "${BLUE}Step 1: Login to Vercel${NC}"
echo -e "${YELLOW}This will open your browser for authentication...${NC}"
vercel login

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Login failed. Please try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logged in successfully!${NC}"
echo ""

# Step 2: Link project
echo -e "${BLUE}Step 2: Linking project to Vercel${NC}"
echo -e "${YELLOW}Select your existing project or create a new one:${NC}"
vercel link

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Linking failed. Please try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project linked successfully!${NC}"
echo ""

# Step 3: Pull configuration
echo -e "${BLUE}Step 3: Pulling Vercel configuration...${NC}"
vercel pull --yes --environment=production

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Could not pull config. Continuing...${NC}"
fi

echo ""

# Step 4: Verify settings
echo -e "${BLUE}Step 4: Verifying project settings...${NC}"

if [ -f ".vercel/project.json" ]; then
    echo -e "${GREEN}✅ Project configuration found${NC}"
    cat .vercel/project.json
else
    echo -e "${YELLOW}⚠️  No project.json found${NC}"
fi

echo ""

# Step 5: Update vercel.json
echo -e "${BLUE}Step 5: Ensuring vercel.json is correct...${NC}"

if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json exists${NC}"
    cat vercel.json
else
    echo -e "${YELLOW}Creating vercel.json...${NC}"
    cat > vercel.json << EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup Complete!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Git"
echo "2. Verify 'Automatic deployments from Git' is ON"
echo "3. Verify 'Production Branch' is set to 'main'"
echo "4. Verify 'Root Directory' is EMPTY (not 'the-lab-interface')"
echo ""
echo -e "${YELLOW}Test auto-deploy:${NC}"
echo "  git add ."
echo "  git commit -m 'Test auto-deploy'"
echo "  git push origin main"
echo ""


