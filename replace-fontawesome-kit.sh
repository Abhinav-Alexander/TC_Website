#!/bin/bash
# Script to replace Font Awesome CDN with custom Kit
# Usage: ./replace-fontawesome-kit.sh YOUR_KIT_ID

if [ -z "$1" ]; then
    echo "❌ Error: Kit ID required"
    echo ""
    echo "Usage: ./replace-fontawesome-kit.sh YOUR_KIT_ID"
    echo ""
    echo "Example: ./replace-fontawesome-kit.sh abc123def456"
    echo ""
    echo "To get your kit ID:"
    echo "1. Go to https://fontawesome.com/kits"
    echo "2. Create a kit with the 59 icons listed in FONTAWESOME_KIT_SETUP.md"
    echo "3. Copy your kit ID from the URL: https://kit.fontawesome.com/YOUR_KIT_ID.js"
    exit 1
fi

KIT_ID="$1"
KIT_URL="https://kit.fontawesome.com/${KIT_ID}.js"

# Old Font Awesome CDN line to remove
OLD_LINE='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">'

# New Font Awesome Kit line
NEW_LINE="<script src=\"${KIT_URL}\" crossorigin=\"anonymous\"></script>"

echo "🔄 Replacing Font Awesome CDN with custom Kit..."
echo "Kit URL: $KIT_URL"
echo ""

# List of files to update
FILES=(
    "index.html"
    "src/about.html"
    "src/services.html"
    "src/pricing.html"
    "src/contact.html"
    "src/resources.html"
    "src/careers.html"
    "src/blog.html"
    "src/thank-you.html"
    "src/thank-you-contact.html"
    "src/thank-you-free.html"
    "src/posts/digital-detox-vs-digital-balance.html"
    "src/posts/therapy-costs-india.html"
    "src/posts/low-mood-to-depression.html"
)

# Counter
updated=0
skipped=0

# Process each file
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "cdnjs.cloudflare.com/ajax/libs/font-awesome" "$file"; then
            # Create backup
            cp "$file" "${file}.backup"
            
            # Replace the line (macOS compatible sed)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|${OLD_LINE}|${NEW_LINE}|g" "$file"
            else
                sed -i "s|${OLD_LINE}|${NEW_LINE}|g" "$file"
            fi
            
            echo "✅ Updated: $file"
            ((updated++))
        else
            echo "⏭️  Skipped: $file (already updated or no Font Awesome found)"
            ((skipped++))
        fi
    else
        echo "❌ Not found: $file"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Replacement Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Files updated: $updated"
echo "Files skipped: $skipped"
echo ""
echo "📦 Backups created with .backup extension"
echo ""
echo "🧪 Next Steps:"
echo "1. Test your website locally"
echo "2. Check that all icons display correctly"
echo "3. Open DevTools → Network tab"
echo "4. Look for your kit loading (~20KB instead of 600KB)"
echo "5. If everything works, commit the changes"
echo "6. Delete backup files: rm **/*.backup"
echo ""
echo "💰 Expected savings: ~580KB (97% reduction)"
echo ""

