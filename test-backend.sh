#!/bin/bash

# Quick Backend Test Script
# This script helps verify the backend is running correctly

echo "🔍 CallBell Backend Health Check"
echo "================================"
echo ""

# Check if backend is running
echo "1️⃣ Checking if backend is responding..."
BACKEND_URL="http://localhost:5000"

if curl -s --connect-timeout 5 "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend is running at $BACKEND_URL"
    echo ""
    
    # Get the response
    echo "📝 Backend Response:"
    curl -s "$BACKEND_URL"
    echo ""
    echo ""
else
    echo "❌ Backend is NOT responding at $BACKEND_URL"
    echo "   Please start the backend with: cd Callbel-Backend && npm start"
    exit 1
fi

# Test API endpoint
echo "2️⃣ Testing API endpoint..."
if curl -s --connect-timeout 5 "$BACKEND_URL/v1/api/users/website" > /dev/null; then
    echo "✅ API endpoints are accessible"
    echo ""
else
    echo "❌ API endpoints are not accessible"
    echo ""
fi

# Show network info
echo "3️⃣ Network Information:"
echo "   For mobile testing, use one of these IPs instead of localhost:"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "   $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print "   http://"$2":5000"}')"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "   $(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print "   http://"$2":5000"}' | cut -d'/' -f1)"
else
    # Windows (Git Bash)
    echo "   Run: ipconfig"
    echo "   Look for IPv4 Address and use: http://YOUR_IP:5000"
fi

echo ""
echo "================================"
echo "✨ Health check complete!"
echo ""
echo "Next steps:"
echo "1. Copy one of the IPs above"
echo "2. Update mobile app socket URL in:"
echo "   callbellCallingApp/lib/services/socket_service.dart"
echo "3. Replace 'localhost' or current URL with your IP"
echo ""
