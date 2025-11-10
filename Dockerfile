# syntax=docker/dockerfile:1.6

###############################################
# Frontend build stage
###############################################
FROM node:18-bullseye AS frontend-builder
WORKDIR /app/frontend

# Install dependencies first to leverage Docker layer caching
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

###############################################
# Backend dependency stage
###############################################
FROM python:3.11-slim AS backend-builder
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements*.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

###############################################
# Runtime image
###############################################
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/app/.local/bin:$PATH" \
    PORT=8000

WORKDIR /app

# Create an unprivileged user to run the application
RUN adduser --disabled-password --gecos "" app

# Copy Python dependencies from the builder stage
COPY --from=backend-builder /usr/local /usr/local

# Copy backend code and static assets
COPY backend/ ./backend
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Ensure the application files are owned by the app user
RUN chown -R app:app /app
USER app

EXPOSE 8000

# Use Gunicorn with Uvicorn workers for production-ready async serving
CMD [
  "gunicorn",
  "backend.main:app",
  "-k", "uvicorn.workers.UvicornWorker",
  "--bind", "0.0.0.0:8000",
  "--workers", "4",
  "--access-logfile", "-",
  "--error-logfile", "-"
]
