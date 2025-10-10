#!/bin/bash
# Script to convert logo files to WebP format for better performance
# 
# Installation required:
# macOS: brew install webp
# Ubuntu/Debian: sudo apt-get install webp
# 
# Then run: chmod +x convert-logos-to-webp.sh && ./convert-logos-to-webp.sh

echo "Converting logos to WebP format..."

if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp not found. Please install webp tools:"
    echo "  macOS: brew install webp"
    echo "  Ubuntu/Debian: sudo apt-get install webp"
    exit 1
fi

# Convert logos
cwebp -q 90 logo/logo_black.png -o logo/logo_black.webp
cwebp -q 90 logo/logo_white.png -o logo/logo_white.webp

echo "✅ Logos converted successfully!"
echo "  - logo/logo_black.webp"
echo "  - logo/logo_white.webp"
echo ""
echo "File size comparison:"
du -h logo/logo_black.png logo/logo_black.webp logo/logo_white.png logo/logo_white.webp 2>/dev/null

