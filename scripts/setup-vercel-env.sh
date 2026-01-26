#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps set up environment variables in Vercel via CLI

set -e

echo "🚀 Afrexia Website - Vercel Environment Setup"
echo "=============================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found"
    echo "Please create .env.local with your environment variables"
    exit 1
fi

echo "✅ .env.local file found"
echo ""

# Prompt for environment
echo "Select environment to configure:"
echo "1) Production"
echo "2) Preview"
echo "3) Both"
read -p "Enter choice (1-3): " env_choice

case $env_choice in
    1)
        ENV_TARGET="production"
        ;;
    2)
        ENV_TARGET="preview"
        ;;
    3)
        ENV_TARGET="production,preview"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📝 Setting up environment variables for: $ENV_TARGET"
echo ""

# Function to add environment variable
add_env_var() {
    local key=$1
    local value=$2
    local target=$3
    
    if [ -n "$value" ] && [ "$value" != "your_"* ]; then
        echo "Adding $key..."
        vercel env add "$key" "$target" <<< "$value" 2>/dev/null || echo "⚠️  $key might already exist"
    else
        echo "⏭️  Skipping $key (placeholder value)"
    fi
}

# Read .env.local and add variables
echo "Reading variables from .env.local..."
echo ""

while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue
    
    # Remove quotes from value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    
    # Add to Vercel
    add_env_var "$key" "$value" "$ENV_TARGET"
done < .env.local

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify variables in Vercel Dashboard → Settings → Environment Variables"
echo "2. Redeploy your application to apply changes"
echo "3. Test the deployment thoroughly"
echo ""
echo "To redeploy:"
echo "  vercel --prod  (for production)"
echo "  vercel         (for preview)"
