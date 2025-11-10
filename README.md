# Mobile Legends Bang Bang Supporter

Mobile Legends Bang Bang Supporter is a web platform that suggests optimal rune and item builds for Mobile Legends heroes. It combines real-time match telemetry with curated esports knowledge to surface meta builds, highlight off-meta opportunities, and make it easy to export builds into the game client.

## Project overview

* **Frontend** – Vite/React single-page application (SPA) served from `/frontend`. The production bundle is baked into the backend container and exposed as static assets.
* **Backend** – FastAPI service living under `/backend`. It exposes REST and WebSocket APIs, performs build recommendations, and proxies third-party game data.
* **Infrastructure** – Multi-stage Dockerfile builds the SPA, installs backend dependencies, and runs Gunicorn with Uvicorn workers. `docker-compose.yml` wires the backend, frontend development server, and Redis cache together for local usage.

## Data sources

The recommendation engine combines several inputs:

1. **Official MLBB match telemetry** via the `MLBB_API_BASE_URL`. Used for real-time hero performance data and item usage rates.
2. **Community scrapes** from popular esports portals for professional build orders. Configure upstream credentials through `MLBB_API_KEY` or additional secrets.
3. **User submitted builds** stored via the configured database (`DATABASE_URL`). These are normalized and validated before merging into the recommendation dataset.

## Getting started

### Prerequisites

* Docker and Docker Compose v2
* Alternatively: Python 3.11+, Node.js 18+, and Redis 7 for a manual setup

### Clone & bootstrap

```bash
git clone https://github.com/your-org/MobileLegendsBangBang_Supporter-.git
cd MobileLegendsBangBang_Supporter-
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Local development with Docker Compose

```bash
docker compose up --build
```

* Backend available at <http://localhost:8000>
* Frontend development server with hot reloading at <http://localhost:5173>
* Redis cache exposed on port `6379`

### Manual local setup (without Docker)

1. **Backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev -- --host
   ```
3. **Redis** – run `redis-server` locally or use Docker: `docker run --rm -p 6379:6379 redis:7-alpine`

## Environment variables

### Backend (`backend/.env`)

| Variable | Description | Default |
| --- | --- | --- |
| `APP_ENV` | Runtime environment (`development`, `staging`, `production`). | `development` |
| `LOG_LEVEL` | Structured log level consumed by UVicorn/Gunicorn. | `info` |
| `DATABASE_URL` | PostgreSQL DSN containing hero build storage. | `postgresql://mlbb:mlbb@db:5432/mlbb` |
| `CACHE_URL` | Redis connection string for caching + rate limiting. | `redis://cache:6379/0` |
| `RATE_LIMIT_WINDOW` | Seconds before rate limiter resets. | `60` |
| `RATE_LIMIT_REQUESTS` | Maximum requests per window. | `120` |
| `MLBB_API_BASE_URL` | Upstream API host for live match data. | `https://api.mobilelegends.com` |
| `MLBB_API_KEY` | Auth token for private data sources. | *(none)* |
| `ALLOWED_ORIGINS` | CORS whitelist (comma separated). | `http://localhost:5173` |
| `SECRET_KEY` | Symmetric secret for signing JWT sessions. | *(required in production)* |
| `SENTRY_DSN` | Observability endpoint for error tracing. | *(none)* |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for API requests. | `http://localhost:8000` |
| `VITE_APP_ENV` | Exposes environment to the SPA for feature toggles. | `development` |
| `VITE_LOG_LEVEL` | Controls browser logging verbosity. | `info` |
| `VITE_ENABLE_OFFMETA_ALERTS` | Enables off-meta build callouts. | `true` |
| `VITE_DEFAULT_REGION` | Default region/language for content. | `global` |
| `VITE_SENTRY_DSN` | Frontend error tracking endpoint. | *(none)* |

### Production configuration notes

* **Logging** – Configure `LOG_LEVEL=warning` and enable structured JSON logs (`ENABLE_REQUEST_LOGGING=true`) so that Gunicorn streams to stdout.
* **Rate limiting** – Tune `RATE_LIMIT_WINDOW` and `RATE_LIMIT_REQUESTS` to match traffic expectations. Use Redis persistence by swapping the cache command for `redis-server --appendonly yes`.
* **Caching** – Increase cache hit rates by pre-warming hero metadata via the `maintenance prime-cache` task (documented below).
* **Security** – Always set strong secrets (`SECRET_KEY`, JWT expiry) and restrict `ALLOWED_ORIGINS` to trusted hosts.

## Development workflow

1. Write backend features inside `backend/` (FastAPI routers, services, etc.). Keep business logic side-effect free for easier testing.
2. Work on the SPA in `frontend/`. Use the compose `frontend` service for hot module replacement or run `npm run dev` manually.
3. Share types and constants via generated OpenAPI clients or by colocating `.ts` contract files in a `/shared` folder (if present).
4. Run linting and tests frequently (see below).
5. When ready, commit changes and rely on the Dockerfile for production parity.

## Testing & quality gates

Run the automated suite locally before pushing:

* **Backend** – `pytest`, `ruff check .`, `mypy backend`
* **Frontend** – `npm run test`, `npm run lint`, `npm run typecheck`
* **Container** – `docker build -t mlbb-supporter .`

From Docker Compose:

```bash
docker compose run --rm backend pytest
docker compose run --rm backend ruff check .
docker compose run --rm frontend npm run test
```

CI should execute the same commands and additionally push the built image to your registry.

## Deployment

1. Build and push the container image:
   ```bash
   docker build -t registry.example.com/mlbb-supporter:$(git rev-parse --short HEAD) .
   docker push registry.example.com/mlbb-supporter:$(git rev-parse --short HEAD)
   ```
2. Provision infrastructure (e.g., Kubernetes or ECS) with Redis and PostgreSQL add-ons.
3. Set environment variables from the `.env.example` templates.
4. Run database migrations (Alembic/SQL scripts) before deploying new backend code.
5. Update traffic routers (Ingress, Load Balancer, or CDN) to point to the new service. Ensure static assets are cached aggressively with cache-busting filenames from the frontend build.

## Off-meta detection heuristics

The system flags off-meta builds when **any** of the following conditions trigger:

1. Item/Rune combination appears in the bottom 10% usage percentile for the hero but has a win rate at least 5% higher than the global average.
2. The build diverges from professional esports references by more than two core items and has at least 50 ranked games in the last 48 hours.
3. Player-submitted builds include crowd-control or utility items atypical for the hero's role, combined with a positive KDA trend.
4. Redis-backed anomaly detection job identifies sudden spikes in win rate for rarely used emblems.

Tune these heuristics in the backend service by editing the analytics module (`backend/services/offmeta.py`, if present) and adjusting the thresholds in environment variables or configuration files.

## Maintenance tasks

Use the application CLI (`python -m backend.cli`) to perform recurring chores:

| Task | Command | Purpose |
| --- | --- | --- |
| Prime cache | `python -m backend.cli prime-cache` | Warm Redis with hero metadata and leaderboard stats. |
| Sync esports data | `python -m backend.cli sync-pro-builds` | Fetch professional builds from configured providers. |
| Rotate stale builds | `python -m backend.cli archive-builds --older-than 30` | Archive player builds older than 30 days. |
| Purge rate limiter | `python -m backend.cli clear-rate-limits` | Reset Redis buckets after incidents. |

Document any new tasks in this table to keep operations reproducible.

## Further reading

* [FastAPI documentation](https://fastapi.tiangolo.com)
* [Gunicorn with Uvicorn workers](https://www.uvicorn.org/deployment/)
* [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
* [Redis administration](https://redis.io/docs/management/)

