# keren-ai

Docker-first microservices app with a React frontend and Spring Boot backend services behind an API Gateway.

## What’s in this repo

- **PostgresML DB** (`db`) – PostgreSQL + ML extensions
- **admin-service** (Spring Boot) – internal/admin APIs and AI integration
- **auth-service** (Spring Boot) – authentication + JWT issuance
- **api-gateway** (Spring Cloud Gateway) – single entry point for backend APIs
- **frontend** (React + Vite) – web UI

## Quickstart (Docker)

### Prerequisites

- Docker Desktop (with Compose)
- (Optional) `make` if you want to use the provided `Makefile`

### 1) Create a `.env`

This repo’s `docker-compose.yaml` expects a set of environment variables.
Create a `.env` file in the repo root (same folder as `docker-compose.yaml`) and set values (see **Environment variables** below).

### 2) Build & run

You can run using **Docker Compose directly**:

```bash
docker compose -f docker-compose.yaml up -d --build
```

Or, using the **Makefile wrapper** (runs the equivalent Compose commands):

```bash
make docker-compose-up
```

### 3) Open the app

- Frontend: http://localhost:4173
- API Gateway (backend entrypoint): http://localhost:4003
- Health check:
  - http://localhost:4003/actuator/health

### Stop

You can stop using Compose directly:

```bash
docker compose -f docker-compose.yaml down
```

Or via Makefile:

```bash
make docker-compose-down
```

## Ports

| Component | Container | Port(s) | Notes |
|---|---:|---:|---|
| db | `keren-ai-db` | (internal) | PostgresML (not exposed to host by default) |
| admin-service | `keren-ai-admin` | (internal) | Reached via gateway |
| auth-service | `keren-ai-auth` | (internal) | Reached via gateway |
| api-gateway | `keren-ai-api-gateway` | `4003:4003` | Main backend entrypoint |
| frontend | `keren-ai-frontend` | `4173:4173` | Web UI |

## API routing (via API Gateway)

The gateway is configured in `api-gateway/src/main/resources/application.yml`.

- Requests to **`/api/v1/auth/**`** are forwarded to the auth service and rewritten to **`/auth/public/**`**
- Requests to **`/api/v1/admin/**`** are forwarded to the admin service and rewritten to **`/admin/**`**

So from your browser/clients you typically call:
- `http://localhost:4003/api/v1/auth/...`
- `http://localhost:4003/api/v1/admin/...`

## Environment variables

Set these in your root `.env` file (or in your shell environment before `docker compose up`).

### Database

- `SPRING_DATASOURCE_USERNAME` – DB username for both services
- `SPRING_DATASOURCE_PASSWORD` – DB password for both services

### JWT (auth)

- `JWT_PRIVATE_KEY` – private key used by `auth-service` to sign tokens
- `JWT_PUBLIC_KEY` – public key used to verify tokens (also used by `admin-service`)

### Auth bootstrap admin user

- `ADMIN_EMAIL` – initial admin account email
- `ADMIN_PASSWORD` – initial admin account password

### Frontend <-> API gateway

- `VITE_API_BASE_URL` – **build-time** value injected into the frontend Docker image.
  - Typically: `http://localhost:4003`
- `FRONTEND_URL` – used by the gateway for CORS allowed origin
  - Default (if not set): `http://localhost:4173`

### AI provider (admin-service)

`admin-service` supports Groq/OpenAI-related configuration via env vars:

- `GROQ_API_KEY`
- `GROQ_BASE_URL`
- `GROQ_MODEL`
- `GROQ_TEMPERATURE`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Troubleshooting

### Frontend fails with “Missing/invalid VITE_API_BASE_URL”

The frontend requires `VITE_API_BASE_URL` at **build time** (Compose passes it as a Docker build arg).
Make sure it’s set in your root `.env`, then rebuild:

```bash
docker compose -f docker-compose.yaml up -d --build
```

If you’re using the Makefile:

```bash
make docker-compose-up
```

### Gateway CORS errors

Set `FRONTEND_URL` to the exact origin you’re using (scheme + host + port), then restart the stack.

### Reset DB volume (WARNING: deletes data)

```bash
docker compose -f docker-compose.yaml down -v
```

## Useful commands

If you’re using the provided `Makefile`:

```bash
make docker-compose-up
make logs
make docker-compose-down
```
