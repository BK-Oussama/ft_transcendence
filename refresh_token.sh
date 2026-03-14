#!/bin/bash

# Configuration
LOGIN_URL="https://localhost/api/auth/login"
REGISTER_URL="https://localhost/api/auth/register"
USER_DATA='{"email":"oussama@1337.ma", "password":"SecurityFirst123", "firstname":"Oussama", "lastname":"BK"}'
LOGIN_DATA='{"email":"oussama@1337.ma", "password":"SecurityFirst123"}'

echo "🔑 Attempting to retrieve fresh JWT_UNIT_TESTS..."

# 1. Try to login
RESPONSE=$(curl -k -s -X POST "$LOGIN_URL" \
     -H "Content-Type: application/json" \
     -d "$LOGIN_DATA")

# 2. Check if login failed (e.g., user doesn't exist)
TOKEN=$(echo $RESPONSE | grep -oP '(?<="accessToken":")[^"]*')

if [ -z "$TOKEN" ]; then
    echo "⚠️ Login failed. Attempting to register user first..."
    curl -k -s -X POST "$REGISTER_URL" \
         -H "Content-Type: application/json" \
         -d "$USER_DATA" > /dev/null
    
    echo "🔄 Retrying login..."
    RESPONSE=$(curl -k -s -X POST "$LOGIN_URL" \
         -H "Content-Type: application/json" \
         -d "$LOGIN_DATA")
    TOKEN=$(echo $RESPONSE | grep -oP '(?<="accessToken":")[^"]*')
fi

# 3. Export and Save
if [ ! -z "$TOKEN" ]; then
    export JWT_UNIT_TESTS="$TOKEN"
    # Also save to a local hidden file so you can 'source' it easily
    echo "export JWT_UNIT_TESTS=\"$TOKEN\"" > .env_token
    echo "✅ Success! Token retrieved and saved to .env_token"
    echo "👉 Run this command now: source .env_token"
else
    echo "❌ Failed to retrieve token. Check if Auth service is running."
    exit 1
fi
