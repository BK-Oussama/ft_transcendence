#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "---------------------------------------------------"
echo "🚀 CHAT SOCIAL & PROFILE SYNC AUDIT"
echo "---------------------------------------------------"

if [ -z "$JWT_UNIT_TESTS" ]; then
    echo -e "${RED}ERROR: JWT_UNIT_TESTS is empty.${NC}"
    exit 1
fi

# 1. TEST PROFILE SYNC (Chat -> Auth Service Communication)
# We use ID 4 because that was the ID of ouboukou@gmail.com in your logs
echo -e "\n👤 Testing Profile Sync (Chat Service calling Auth Service)..."
response=$(curl -k -s -H "Authorization: Bearer $JWT_UNIT_TESTS" https://localhost/api/chat/profile/4)
if [[ $response == *"ouboukou@gmail.com"* ]]; then
    echo -e "[✅] Profile Sync: ${GREEN}SUCCESS (Data fetched from Auth)${NC}"
else
    echo -e "[❌] Profile Sync: ${RED}FAILED${NC}"
    echo "Response: $response"
fi

# 2. TEST FRIENDS SYSTEM (Chat -> Chat DB)
echo -e "\n👬 Testing Friends System (Saving relationship to Chat DB)..."
status_code=$(curl -k -s -o /dev/null -w "%{http_code}" \
    -X POST -H "Authorization: Bearer $JWT_UNIT_TESTS" \
    https://localhost/api/chat/friend/99) # Adding a dummy friend ID 99

if [ "$status_code" == "201" ]; then
    echo -e "[✅] Add Friend: ${GREEN}201 CREATED${NC}"
else
    echo -e "[❌] Add Friend: ${RED}$status_code ERROR${NC}"
fi

# 3. TEST HISTORY PERSISTENCE
echo -e "\n📜 Testing History Persistence..."
status_code=$(curl -k -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $JWT_UNIT_TESTS" \
    https://localhost/api/chat/history)

if [ "$status_code" == "200" ]; then
    echo -e "[✅] Chat History: ${GREEN}200 OK${NC}"
else
    echo -e "[❌] Chat History: ${RED}$status_code ERROR${NC}"
fi

echo -e "\n---------------------------------------------------"