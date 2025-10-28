# 🧭 Task Manager

A full-stack **Task Management System** built with **React (Vite + TypeScript)** on the frontend and **Spring Boot (Java)** on the backend.

The project is fully containerized using **Docker** and can be launched in both development and production modes with simple `make` commands.

## 🚀 Features

- 🧩 Full-stack architecture (React + Spring Boot)
- 🐳 Dockerized environment for dev and prod
- 🌱 Hot reload for frontend and backend in development
- 🔐 Environment-based configuration
- 🗂️ RESTful API for task management
- 📦 Easy to build, run, and deploy with `Makefile`

## ⚙️ Tech Stack

**Frontend**

- React (Vite)
- React Router
- React Query
- TypeScript
- Tailwind CSS
- Axios
- Eslint & Prettier

**Backend**

- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- Java 17+
- Maven
- REST API

**Infrastructure**

- Docker & Docker Compose
- Makefile for environment management

## 🔧 Environment Setup

### 1. Prerequisites

Make sure you have installed:

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)
- [Java 17+](https://adoptium.net/) (if you want to run backend locally without Docker)
- [Node.js 18+](https://nodejs.org/) (if you want to run frontend locally without Docker)

### 2. Environment Variables

You’ll find example `.env` and `.env.dev` files in the project root, frontend, and backend directories.

Typical variables might look like:

**Backend `.env`**

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=pass123
SERVER_PORT=8080
```

**Frontend `.env`**

```bash
VITE_API_URL=http://backend:8080
VITE_PORT=80
```

## 🧰 Usage

### 💻 Development Mode

Run both frontend and backend with hot reload:

```bash
make dev
```

This command builds and starts the containers defined in `docker-compose.dev.yml`.

Then open:

- Frontend → http://localhost:3000
- Backend API → http://localhost:8080

### 🚀 Production Mode

Build and start the production containers:

```bash
make prod
```

This runs the services in detached mode using `docker-compose.yml`.

## 🧱 Building Manually

If you prefer to run without Docker:

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
yarn install
yarn dev
```

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
