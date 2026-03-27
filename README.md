This project has been created as part of the 42 curriculum by ouboukou, amarouf, mzelouan, zelkalai.

# ft_transcendence

**ft_transcendence** is a full-stack web application built as part of the 42 curriculum. The project focuses on real-time interactions, microservices architecture, and scalable system design, providing a centralized hub for project management, communication, and social interaction.

## 👥 Team Organization and Project Management

Our team is organized into specialized roles to ensure a robust implementation of the microservices architecture and seamless integration between services.


| Name | Role | Core Responsibilities |
| :--- | :--- | :--- |
| **mzelouan** | **Project Manager (PM)** | Lead architect. Responsible for system design, milestone tracking, and cross-service communication logic. |
| **amarouf** | **Product Owner (PO)** | Feature validation and quality assurance. Focused on user experience (UX) and final API authentication standards. |
| **zelkalai** | **Kanban System Dev** | Engineered the collaborative board logic, task persistence, and real-time state synchronization. |
| **ouboukou** | **DevOps & Chat Lead** | Managed the Docker containerization strategy, Nginx gateway, and the WebSocket messaging infrastructure. |


## 🛠️ Technical Stack

* **Frontend:** React with Vite (TypeScript)
* **Backend:** NestJS Microservices
* **Database:** PostgreSQL with Prisma ORM
* **Real-time:** WebSockets (Socket.io)
* **Infrastructure:** Docker & Docker Compose
* **Security:** JWT Authentication & Argon2 Password Hashing

## 🧩 Implemented Modules & Points

We have targeted a high-point threshold by implementing the following modules:

### Web (Major - 2pts each)
* **Framework Integration:** Use of React (Frontend) and NestJS (Backend).
* **Real-time Features:** Global real-time chat with message persistence.
* **User Interaction:** Profile system with bios, friends system, and blocking logic.

### User Management (Major - 2pts each)
* **Standard User Management:** Avatar uploads, profile editing, and secure account settings.
* **Organization System:** Fully functional Kanban boards for project tracking.

### DevOps & Cybersecurity
* **Microservices (Major - 2pts):** Decoupled architecture for Auth, Chat, and Boards services.
* **GDPR Compliance (Minor - 1pt):** Data portability (JSON export) and the "Right to be Forgotten" (Account Deletion).
* **OAuth 2.0 (Minor - 1pt):** Integration for remote authentication providers.

**Current Points: 16** (Exceeds mandatory 14-point minimum).

## 🚀 Getting Started

### Prerequisites
* Docker & Docker Compose installed.

### Installation
1.  **Clone the repo:**
    git clone [https://github.com/BK-Oussama/ft.git](https://github.com/BK-Oussama/ft.git)
    cd ft
2.  **Build and run:**
    docker compose up --build || sudo make

3.  **Access the app:** `https://localhost`

## 🧪 API & Authentication Testing

All API calls must be authenticated via JWT. You can test the flow using these commands:

**1. Register a new user:**

curl -k -i -X POST https://localhost/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "SecurityFirst123",
       "firstname": "Oussama",
       "lastname": "BK"
     }'

**2. Login to get Token:**

curl -k -i -X POST https://localhost/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "SecurityFirst123"
     }'

**3. Call protected service (Boards):**
TOKEN="your_jwt_token_here"
curl -k -i -X GET https://localhost/api/boards/health \
     -H "Authorization: Bearer $TOKEN"


## General Requirements

    Data Portability: Users can download their information (Full Name, Email, Bio, Job Title) in JSON format from the Settings page.

    Privacy: The application includes a dedicated Privacy Policy and Terms of Service.

    Microservices: All services communicate via a secure internal gateway.


## 📚 Resources & Third-Party Libraries

### Backend (NestJS Microservices)
* **[NestJS](https://docs.nestjs.com/):** Progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
* **[Prisma ORM](https://www.prisma.io/):** Next-generation Node.js and TypeScript ORM used for type-safe database access and migrations.
* **[Argon2](https://www.npmjs.com/package/argon2):** Winner of the Password Hashing Competition, used for secure credential storage.
* **[Passport.js](http://www.passportjs.org/):** Simple, unobtrusive authentication middleware for Node.js.

### Frontend (React SPA)
* **[Vite](https://vitejs.dev/):** Next-generation frontend tooling providing a fast and lean development experience.
* **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development and consistent design.
* **[Socket.io](https://socket.io/):** Enables real-time, bi-directional, and event-based communication between web clients and servers.
* **[Axios](https://axios-http.com/):** Promise-based HTTP client used for browser-to-gateway communication.
* **[React Hot Toast](https://react-hot-toast.com/):** Lightweight and customizable notifications for a better user experience.

### Infrastructure & DevOps
* **[Docker](https://www.docker.com/):** Containerization platform used to ensure environment consistency across development and deployment.
* **[Nginx](https://www.nginx.com/):** High-performance HTTP server and reverse proxy used as the system's API Gateway.


## 🤖 AI Usage Disclosure

In compliance with the **ft_transcendence** project requirements, we disclose that Artificial Intelligence was used during the development process. 

### Scope of AI Assistance:
1.  **Architecture Brainstorming:** Assistance in designing the microservices communication flow and Identity Bridge between the Auth and Chat services.
2.  **Logic Debugging:** Identifying race conditions in the account deletion flow and resolving TypeScript build errors (e.g., missing imports/decorators).
3.  **Documentation Drafting:** Generating templates for the README, Privacy Policy, and Terms of Service.

*All logic, database schemas, and architectural decisions generated or suggested by AI were manually reviewed, critiqued, and integrated by the team to ensure project-specific compatibility and compliance with the 42 subject rules.*