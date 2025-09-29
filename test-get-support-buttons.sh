#!/bin/bash

echo "🔍 Testing all 'Get Support' buttons across Therapy Council website..."
echo "================================================================"

# Test function
test_page() {
    local page_name="$1"
    local page_url="$2"
    
    echo -n "Testing $page_name... "
    
    # Get HTTP status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$page_url")
    
    if [ "$status" = "200" ]; then
        echo "✅ ($status)"
        
        # Check for Get Support button with WhatsApp link
        if curl -s "$page_url" | grep -q "wa.me/919211750322.*Get Support"; then
            echo "  ✅ Get Support button with WhatsApp link found"
        elif curl -s "$page_url" | grep -q "Get Support"; then
            echo "  ⚠️  Get Support button found but may not have WhatsApp link"
        else
            echo "  ❌ No Get Support button found"
        fi
    else
        echo "❌ ($status)"
    fi
    echo
}

# Test all main pages
test_page "Home" "http://localhost:8000/"
test_page "About" "http://localhost:8000/about/"
test_page "Services" "http://localhost:8000/services/"
test_page "Pricing" "http://localhost:8000/pricing/"
test_page "Contact" "http://localhost:8000/contact/"
test_page "Resources" "http://localhost:8000/resources/"
test_page "Careers" "http://localhost:8000/careers/"

# Test thank-you pages
test_page "Thank You" "http://localhost:8000/thank-you/"
test_page "Thank You Contact" "http://localhost:8000/thank-you-contact/"
test_page "Thank You Free" "http://localhost:8000/thank-you-free/"

# Test blog pages
test_page "Blog" "http://localhost:8000/blog/"

# Test blog posts
test_page "Digital Detox Post" "http://localhost:8000/resources/posts/digital-detox-vs-digital-balance/"
test_page "Therapy Costs Post" "http://localhost:8000/resources/posts/therapy-costs-india/"

echo "================================================================"
echo "✅ Test completed!"
