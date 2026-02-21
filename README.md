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