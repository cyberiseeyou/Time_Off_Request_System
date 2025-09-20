# Docker Setup for Time Off System

## Quick Start

### Basic API + Database Setup
```bash
# Start core services (API + MySQL)
docker compose up -d mysql api

# View logs
docker compose logs -f api

# Health check
curl http://localhost:8000/health
```

### Full Stack Setup
```bash
# Start all services including web frontend
docker compose --profile full up -d

# Or start with specific profiles
docker compose --profile web up -d  # Include web frontend
docker compose --profile n8n up -d  # Include n8n workflow engine
```

### Development Setup
```bash
# Start with development tools (includes phpMyAdmin)
docker compose --profile dev up -d

# Access phpMyAdmin: http://localhost:8080
# MySQL: localhost:3306
# API: http://localhost:8000
```

## Service Overview

| Service | Port | Profile | Description |
|---------|------|---------|-------------|
| mysql | 3306 | default | MySQL 8.0 database |
| api | 8000 | default | Python FastAPI backend |
| web | 3000 | web | Next.js frontend (future) |
| n8n | 5678 | n8n | Workflow automation |
| phpmyadmin | 8080 | dev | Database admin tool |

## Environment Variables

Required variables in `.env`:
```bash
# Database
MYSQL_DATABASE=time_off_system
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password
MYSQL_ROOT_PASSWORD=root_password

# Application
API_PORT=8000
WEB_PORT=3000
NODE_ENV=development

# n8n (optional)
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
N8N_PORT=5678
```

## Commands

```bash
# Start core services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f [service_name]

# Rebuild services
docker compose build [service_name]

# Reset everything
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## Health Checks

All services include health checks:
- **MySQL**: `mysqladmin ping`
- **API**: HTTP GET to `/health` endpoint
- **Dependencies**: API waits for MySQL to be healthy

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3306, 8000, 3000, 5678, 8080 are available
2. **Database connection**: Check that MySQL is healthy before API starts
3. **Environment variables**: Verify `.env` file is present and correctly formatted

### Logs
```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs api
docker compose logs mysql

# Follow logs in real-time
docker compose logs -f api
```

### Reset Database
```bash
# Remove volumes and restart
docker compose down -v
docker compose up -d
```