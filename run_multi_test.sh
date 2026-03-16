#!/bin/bash

echo "🔑 Fetching fresh tokens..."

# 1. Capture tokens
# We use -k because of self-signed certs

T_A=$(curl -s -k -X POST https://localhost/api/auth/login -H "Content-Type: application/json" -d '{"email":"alpha@test.com","password":"password"}' | jq -r .accessToken)

T_B=$(curl -s -k -X POST https://localhost/api/auth/login -H "Content-Type: application/json" -d '{"email":"beta@test.com","password":"password"}' | jq -r .accessToken)


# 2. Check if we actually got tokens
if [ "$T_A" == "null" ] || [ "$T_B" == "null" ]; then
    echo "❌ Error: Could not get tokens. Make sure users alpha@test.com and beta@test.com exist!"
    exit 1
fi

echo "🚀 Launching Node.js Multi-Client Test..."

# 3. Run the node script with the tokens injected
TOKEN_A=$T_A TOKEN_B=$T_B node multi_client.js