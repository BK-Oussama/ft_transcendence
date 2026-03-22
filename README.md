# ft_
ft_transcendence is a full-stack web application built as part of the 42 curriculum, focusing on real-time interactions, modern web technologies, and scalable system design.



We need to discuss how Abdllah will generate or ensure that each API call is authenticated (JWT).



The Professional Path:
Once your 4 developers start working and you have "real" data you care about, you should switch from db push to Migrations:

    Developer runs npx prisma migrate dev --name add_profile_picture locally.

    This creates a SQL file in prisma/migrations/.

    You change the Dockerfile back to npx prisma migrate deploy.

    migrate deploy is 100% safe—it only applies new SQL changes and never deletes data.


    I HAVE ADDED THIS TEXT FOR TESTING AND PUSHING THE AUTH-BRANCH, BEFOR PUSHING THE DECLARED NEW LOCAL BRANCH TO REMOT.


The users.ts file is a perfect "Mock" for now, but as you scale, we’ll eventually move those IDs to the database.





# TESTING AUTH with backend services:

- Create the User (If you haven't yet):
curl -k -i -X POST https://localhost/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "oussama@1337.ma",
       "password": "SecurityFirst123",
       "firstname": "Oussama",
       "lastname": "BK"
     }'

- Login to get the Access Token
curl -k -i -X POST https://localhost/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "oussama@1337.ma",
       "password": "SecurityFirst123"
     }'

- Use the Token for Boards or any other service:

# Set a temporary variable to make it easier (Paste your token here)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5..."

# Now call the Boards Health Check
curl -k -i -X GET https://localhost/api/boards/health \
     -H "Authorization: Bearer $TOKEN"