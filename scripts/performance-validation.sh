#!/bin/bash

# Performance Validation Script for SCPB Partner Section
# Task 16.3: Performance validation
# 
# This script validates:
# - Lighthouse performance score: 90+
# - LCP (Largest Contentful Paint): < 2.5s
# - CLS (Cumulative Layout Shift): < 0.1
# - Image load times
# - Component render time: < 50ms

set -e

echo "🚀 Starting Performance Validation for SCPB Partner Section"
echo "============================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Run component-level performance tests
echo "📊 Step 1: Running component-level performance tests..."
echo ""
npm run test:run -- components/sections/PartnerSection/__tests__/performance-validation.test.tsx

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Component performance tests passed${NC}"
else
    echo -e "${RED}✗ Component performance tests failed${NC}"
    exit 1
fi

echo ""
echo "============================================================"
echo ""

# Step 2: Build the project for production
echo "🔨 Step 2: Building project for production..."
echo ""
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""
echo "============================================================"
echo ""

# Step 3: Run Lighthouse CI audit
echo "🔍 Step 3: Running Lighthouse CI audit..."
echo ""
echo -e "${YELLOW}Note: This will start the production server and run Lighthouse audits${NC}"
echo -e "${YELLOW}Target metrics:${NC}"
echo "  - Performance Score: 90+"
echo "  - LCP: < 2.5s"
echo "  - CLS: < 0.1"
echo ""

# Check if @lhci/cli is installed
if ! command -v lhci &> /dev/null; then
    echo -e "${YELLOW}⚠ Lighthouse CI not found. Installing...${NC}"
    npm install -g @lhci/cli
fi

# Run Lighthouse CI
npm run lighthouse

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Lighthouse audit passed${NC}"
else
    echo -e "${RED}✗ Lighthouse audit failed${NC}"
    echo -e "${YELLOW}Note: Check the Lighthouse report for details${NC}"
    exit 1
fi

echo ""
echo "============================================================"
echo ""
echo -e "${GREEN}✅ Performance Validation Complete!${NC}"
echo ""
echo "Summary:"
echo "  ✓ Component render time: < 50ms"
echo "  ✓ Image optimization: Lazy loading, priority, WebP"
echo "  ✓ Layout stability: CLS < 0.1"
echo "  ✓ Performance score: 90+"
echo "  ✓ LCP: < 2.5s"
echo ""
echo "All performance targets met! 🎉"
