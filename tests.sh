#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "---------------------------------------------------"
echo "🚀 FT_TRANSCENDENCE FULL AUTHENTICATED AUDIT"
echo "---------------------------------------------------"

# 1. PUBLIC HANDSHAKES
echo -e "\n🔍 Testing Public Handshakes"
services=("auth/status" "dashboard/status" "boards/status" "chat/health")
for path in "${services[@]}"; do
    response=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/api/$path)
    [ "$response" == "200" ] && echo -e "[✅] $path: ${GREEN}200 OK${NC}" || echo -e "[❌] $path: ${RED}$response ERROR${NC}"
done

# 2. AUTHORIZED BUSINESS LOGIC (Using your JWT)
echo -e "\n🔑 Testing Authenticated Routes (Expect: 200 OK)"
if [ -z "$JWT_UNIT_TESTS" ]; then
    echo -e "${RED}ERROR: JWT_UNIT_TESTS variable is empty. Run: export JWT_UNIT_TESTS='token'${NC}"
else
    # Testing endpoints that require a valid login
    # For boards/tasks, make sure you have a valid projectId in your DB (usually 1)
    authed=("dashboard/projects" "auth/me" "boards/tasks?projectId=1")
    
    for path in "${authed[@]}"; do
        response=$(curl -k -s -o /dev/null -w "%{http_code}" \
            -H "Authorization: Bearer $JWT_UNIT_TESTS" \
            "https://localhost/api/$path")
            
        if [ "$response" == "200" ]; then
            echo -e "[🔓] $path: ${GREEN}200 SUCCESS (Authenticated)${NC}"
        else
            echo -e "[❌] $path: ${RED}$response (Auth Failed)${NC}"
        fi
    done
fi

echo -e "\n---------------------------------------------------"


# #!/bin/bash

# # Colors for better readability
# GREEN='\033[0;32m'
# RED='\033[0;31m'
# NC='\033[0m' # No Color

# echo "---------------------------------------------------"
# echo "🚀 FT_TRANSCENDENCE INFRASTRUCTURE AUDIT"
# echo "---------------------------------------------------"

# # 1. PUBLIC INFRASTRUCTURE TESTS (Should be 200 OK)
# echo -e "\n🔍 Testing Public Handshakes (Expect: 200 OK)"

# services=("auth/status" "dashboard/status" "boards/status" "chat/health")

# for path in "${services[@]}"; do
#     response=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/api/$path)
#     if [ "$response" == "200" ]; then
#         echo -e "[✅] $path: ${GREEN}200 OK${NC}"
#     else
#         echo -e "[❌] $path: ${RED}$response ERROR${NC}"
#     fi
# done

# # 2. PROTECTED LOGIC TESTS (Should be 401 Unauthorized)
# echo -e "\n🛡️ Testing Security Guards (Expect: 401 Unauthorized)"

# protected=("dashboard/projects" "boards/tasks" "auth/me")

# for path in "${protected[@]}"; do
#     response=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/api/$path)
#     if [ "$response" == "401" ]; then
#         echo -e "[🔒] $path: ${GREEN}401 SUCCESS (Blocked)${NC}"
#     else
#         echo -e "[⚠️] $path: ${RED}$response (Security Gap!)${NC}"
#     fi
# done

# echo -e "\n---------------------------------------------------"
# echo "✅ Audit Complete."
