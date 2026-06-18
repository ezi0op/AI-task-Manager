# AI Task Manager

<p align="center">
  <img src="ai-task-manager-front/public/logo1.png" alt="AI Task Manager Logo" width="90" />
</p>

<h3 align="center">Smart task management with AI automation, JWT security, admin controls, and blockchain-inspired audit logging.</h3>

<p align="center">
  <img alt="Java" src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" />
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.5.15-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img alt="Spring AI" src="https://img.shields.io/badge/Spring%20AI-1.0.1-6DB33F?style=for-the-badge" />
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens" />
  <img alt="Maven" src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" />
</p>

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [AI Features](#ai-features)
- [AI Workflow](#ai-workflow)
- [Security](#security)
- [Blockchain Audit Trail](#blockchain-audit-trail)
- [Architecture](#architecture)
- [Architecture Overview](#architecture-overview)
- [Database Design](#database-design)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

## Overview

AI Task Manager is a smart task management system that combines traditional task planning, AI-powered automation, role-based access control, admin management, and blockchain-inspired task audit logging.

The application helps users register, log in, manage tasks, track task status, view dashboard statistics, update profile details, change passwords, generate AI-powered task details, review AI productivity summaries, receive smart task suggestions, access role-based features, and inspect a verifiable task audit trail.

## Live Demo

| Service | URL |
| --- | --- |
| Frontend | [https://ai-task-manager-sable.vercel.app](https://ai-task-manager-sable.vercel.app/) |
| Backend | [https://ai-task-manager-2jrh.onrender.com](https://ai-task-manager-2jrh.onrender.com) |
| Swagger | [https://ai-task-manager-2jrh.onrender.com/swagger-ui/index.html](https://ai-task-manager-2jrh.onrender.com/swagger-ui/index.html) |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5.15 |
| Security | Spring Security, JWT, BCrypt, Stateless Sessions |
| Persistence | Spring Data JPA, Hibernate, MySQL |
| AI Integration | Spring AI 1.0.1, OpenRouter / OpenAI-compatible models |
| API Docs | Swagger OpenAPI |
| Build Tool | Maven |
| Utilities | Lombok |
| Frontend | React, Vite, Tailwind CSS, Axios, Recharts |

## Features

### User Features

- User registration and login
- JWT-based authentication
- Create, update, delete, and view tasks
- Change task status
- Dashboard statistics
- Profile management
- Password change
- AI task generation, summaries, and suggestions

### Admin Features

- View all users
- View user details
- Delete users
- Manage user roles
- View all tasks
- Analytics dashboard
- Blockchain audit trail

## AI Features

### 1. AI Task Description Generator

Generates a complete task plan from a simple title.

| Input | Output |
| --- | --- |
| Task title | Task description |
|  | Suggested priority |
|  | Estimated completion effort |

Example:

```text
Input:
Prepare client presentation

Output:
Description: Create a professional presentation covering project progress and client requirements.
Priority: HIGH
Estimated Effort: 6 Hours
```

### 2. AI Task Summarizer

Creates productivity summaries from a user's task list.

- Daily productivity summary
- Completed task statistics
- Pending task insights
- AI-generated progress summary

Example:

```text
Total Tasks: 12
Completed: 5
Pending: 7
AI Generated Summary
```

### 3. AI Smart Suggestions

Analyzes workload and recommends practical next actions.

- Priority recommendations
- Duplicate task detection
- Due-date risk alerts

Example:

```text
Focus on HIGH priority tasks first.
No duplicate tasks detected.
2 tasks are approaching their deadlines.
```

## AI Workflow

1. User enters a task title.
2. Frontend sends the request to the AI API.
3. Spring AI sends a structured prompt to OpenRouter through the OpenAI-compatible chat model.
4. AI returns generated task details:
   - Description
   - Priority
   - Estimated effort
   - Due date
5. User can save the generated task into the task manager.

Additional AI features:

- Productivity summary
- Smart suggestions
- Duplicate task detection
- Due-date risk alerts

## Security

AI Task Manager uses Spring Security with stateless JWT authentication to secure user and admin workflows.

| Security Capability | Implementation |
| --- | --- |
| Authentication | JWT access tokens |
| Password Protection | BCrypt password encryption |
| Authorization | Role-based access for USER and ADMIN |
| Session Strategy | Stateless Spring Security configuration |
| Request Validation | JWT request filter |
| Logout Support | Token blacklisting |
| Protected APIs | Role-aware controller access |

## Blockchain Audit Trail

The project includes a lightweight blockchain-inspired audit trail for task operations. Every important task action creates a new block linked to the previous block hash.

Recorded actions:

- `TASK_CREATED`
- `TASK_UPDATED`
- `STATUS_CHANGED`
- `TASK_DELETED`

Each audit block stores:

| Field | Description |
| --- | --- |
| `taskId` | Related task identifier |
| `action` | Task event name |
| `previousHash` | Hash of the previous audit block |
| `currentHash` | Hash generated for the current block |
| `createdAt` | Block creation timestamp |

Purpose:

- Immutable task history
- Audit tracking
- Change verification
- Tamper detection

## Architecture

```mermaid
flowchart TD
    Client["React Frontend"] --> Controllers["Controller Layer"]
    Controllers --> Security["Spring Security + JWT Filter"]
    Security --> Services["Service Layer"]
    Services --> Repositories["Repository Layer"]
    Repositories --> Database[("MySQL Database")]

    Services --> AI["AI Service"]
    AI --> OpenRouter["OpenRouter / OpenAI-Compatible API"]

    Services --> Blockchain["Blockchain Service"]
    Blockchain --> AuditBlocks[("TaskBlock Audit Ledger")]

    Controllers --> Swagger["Swagger OpenAPI Docs"]
```

### Layered Flow

```mermaid
flowchart LR
    A["Controller Layer"] --> B["Service Layer"]
    B --> C["Repository Layer"]
    C --> D[("MySQL Database")]
```

Additional components:

- Spring Security
- JWT filter
- AI service
- Blockchain service
- OpenRouter integration
- Swagger OpenAPI

## Architecture Overview

```text
Frontend (React + Vite)
        |
Axios API Calls
        |
Spring Boot REST APIs
        |
Service Layer
        |
JPA/Hibernate
        |
MySQL Database
```

Additional services:

- JWT Security
- Spring AI Integration
- Blockchain Audit Service

## Database Design

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    USER {
        long id
        string name
        string email
        string password
        string role
        boolean active
        datetime createdAt
    }
    TASK {
        long id
        string title
        string description
        string priority
        string status
        date dueDate
        long user_id
    }
    BLACKLISTED_TOKEN {
        long id
        string token
        datetime blacklistedAt
    }
    TASK_BLOCK {
        long id
        long taskId
        string action
        string previousHash
        string currentHash
        datetime createdAt
    }
```

### Entities

| Entity | Fields |
| --- | --- |
| `User` | `id`, `name`, `email`, `password`, `role`, `active`, `createdAt` |
| `Task` | `id`, `title`, `description`, `priority`, `status`, `dueDate`, `user` |
| `BlacklistedToken` | `id`, `token`, `blacklistedAt` |
| `TaskBlock` | `id`, `taskId`, `action`, `previousHash`, `currentHash`, `createdAt` |

## Database Schema

![Database Schema](docs/screenshots/database-schema.png)

## Setup Instructions

### Prerequisites

- Java 21
- Maven
- MySQL
- OpenRouter API key or OpenAI-compatible API key
- Node.js and npm for the frontend

### 1. Clone Repository

```bash
git clone <repository-url>
cd ai-task-manager
```

### 2. Create Database

```sql
CREATE DATABASE aitask;
```

### 3. Configure Backend

Update `ai-task-manager/src/main/resources/application.properties` or provide environment variables:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aitask
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update

spring.ai.openai.api-key=YOUR_OPENROUTER_API_KEY
spring.ai.openai.base-url=https://openrouter.ai/api/v1
spring.ai.openai.chat.options.model=openai/gpt-4o-mini
```

Recommended environment variable approach:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/aitask
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_AI_OPENAI_API_KEY=YOUR_OPENROUTER_API_KEY
```

### 4. Build Backend

```bash
cd ai-task-manager
mvn clean install
```

### 5. Run Backend

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 6. Run Frontend

```bash
cd ../ai-task-manager-front
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

### 7. Swagger Documentation

```text
http://localhost:8080/swagger-ui/index.html
```

## API Endpoints

### Authentication APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and return JWT |
| `POST` | `/api/auth/logout` | Logout user and blacklist token |

### Task APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/tasks` | Create task |
| `GET` | `/api/tasks/email/{email}` | Get all tasks by user email |
| `GET` | `/api/tasks/{id}/email/{email}` | Get task by ID and user email |
| `PUT` | `/api/tasks/{id}` | Update task |
| `PATCH` | `/api/tasks/{id}/status/{status}/email/{email}` | Update task status |
| `DELETE` | `/api/tasks/id/{id}/email/{email}` | Delete task |
| `GET` | `/api/tasks/dashboard/{email}` | Get dashboard statistics |

### User APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users/profile/{email}` | Get user profile |
| `PUT` | `/api/users/profile/{email}` | Update user profile |
| `PUT` | `/api/users/change-password/{email}` | Change password |
| `DELETE` | `/api/users/{email}` | Delete user account |

### AI APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/ai/generate-task-details` | Generate task description, priority, and effort |
| `GET` | `/api/ai/summary/{email}` | Generate productivity summary |
| `GET` | `/api/ai/suggestions/{email}` | Generate smart task suggestions |

### Admin APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/stats` | Get admin statistics |
| `GET` | `/api/admin/users` | View all users |
| `GET` | `/api/admin/users/{userId}` | View user details |
| `PATCH` | `/api/admin/users/{userId}/role/{role}` | Manage user role |
| `DELETE` | `/api/admin/users/{userId}` | Delete user |
| `GET` | `/api/admin/tasks` | View all tasks |

### Blockchain Audit APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/audit-trail` | View blockchain-inspired task audit trail |

## Screenshots

### Landing Page

![Landing Page](docs/screenshots/landing-page.png)

### Login Page

![Login Page](docs/screenshots/login-page.png)

### User Dashboard

![User Dashboard](docs/screenshots/user-dashboard.png)

### AI Suggestions

![AI Suggestions](docs/screenshots/ai-suggestions.png)

### Admin Statistics Dashboard

![Admin Statistics Dashboard](docs/screenshots/admin-statistics-dashboard.png)

### Manage Users

![Manage Users](docs/screenshots/manage-users.png)

### All Tasks Management

![All Tasks Management](docs/screenshots/all-tasks-management.png)

### Analytics Dashboard

![Analytics Dashboard](docs/screenshots/analytics-dashboard.png)

### AI System Insights

![AI System Insights](docs/screenshots/analytics-insights.png)

### Blockchain Audit Trail

![Blockchain Audit Trail](docs/screenshots/blockchain-audit-trail.png)

### Audit Trail Table

![Audit Trail Table](docs/screenshots/audit-trail-table.png)

## Future Enhancements

- Email notifications
- Scheduled task reminders
- Real Ethereum blockchain integration
- MetaMask wallet integration
- Mobile application
- Team collaboration
- Real-time notifications
- AI chat assistant

## Author

**Amit Birajadar**

---

<p align="center">
  Built with Java, Spring Boot, Spring AI, MySQL, JWT, and a productivity-first UI.
</p>
