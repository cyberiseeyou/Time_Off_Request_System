# Time Off System - Setup Documentation

## Overview
This document provides step-by-step instructions for setting up the Time Off System MVP with n8n workflow automation and database infrastructure.

## Prerequisites
- Docker and Docker Compose installed
- Python 3.11+ installed
- Git (for version control)

## Quick Start

### 1. Initial Setup
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd time-off-system

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Setup (SQLite MVP)
```bash
# Create SQLite database with sample data
python3 database/create_sqlite_db.py

# Test database connectivity
python3 database/test_connection.py
```

Expected output:
- ✓ Database created successfully
- ✓ All database tests passed successfully
- ✓ Foreign key constraints working

### 3. Start n8n Workflow System
```bash
# Start n8n container
docker compose up -d n8n

# Access n8n web interface
# http://localhost:5678
# Username: admin
# Password: admin123
```

### 4. Start Full Application Stack
```bash
# Start all services
docker compose up -d

# Services will be available at:
# - n8n: http://localhost:5678
# - Web App: http://localhost:3000 (when implemented)
# - API: http://localhost:8000 (when implemented)
# - MySQL: localhost:3306 (for production)
```

## Configuration

### Environment Variables (.env)
```bash
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
N8N_HOST=localhost
N8N_PORT=5678

# Database Configuration
DATABASE_URL=mysql://app_user:app_password@localhost:3306/time_off_system
SQLITE_DB_PATH=./database/time_off_system.db

# Application Configuration
NODE_ENV=development
API_PORT=8000
WEB_PORT=3000
```

### Database Schema

#### Managers Table
```sql
CREATE TABLE managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Time Off Requests Table
```sql
CREATE TABLE time_off_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    manager_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE CASCADE
);
```

## n8n Workflow Configuration

### Time Off Request Workflow
The system includes a pre-configured n8n workflow for handling time-off requests:

**Workflow File:** `n8n/workflows/time-off-workflow.json`

**Webhook Endpoint:** `http://localhost:5678/webhook/time-off-request`

**Request Format:**
```json
{
  "employee_name": "John Doe",
  "start_date": "2025-09-25",
  "end_date": "2025-09-27",
  "reason": "Vacation",
  "manager_id": 1
}
```

**Response Format:**
```json
{
  "status": "success",
  "message": "Time off request submitted successfully",
  "request_id": 123
}
```

### Importing the Workflow
1. Access n8n at http://localhost:5678
2. Login with admin/admin123
3. Import the workflow from `n8n/workflows/time-off-workflow.json`
4. Configure database connection credentials

## Testing

### Database Tests
```bash
# Run comprehensive database tests
python3 database/test_connection.py
```

Tests include:
- ✓ Database connectivity
- ✓ CRUD operations (Create, Read, Update, Delete)
- ✓ Foreign key constraints
- ✓ Schema verification
- ✓ Sample data validation

### Manual Testing
1. **Database Access:**
   ```bash
   sqlite3 database/time_off_system.db
   .tables
   SELECT * FROM managers;
   SELECT * FROM time_off_requests;
   ```

2. **n8n Workflow Testing:**
   ```bash
   curl -X POST http://localhost:5678/webhook/time-off-request \
        -H "Content-Type: application/json" \
        -d '{
          "employee_name": "Test User",
          "start_date": "2025-12-01",
          "end_date": "2025-12-03",
          "reason": "Test request",
          "manager_id": 1
        }'
   ```

## Troubleshooting

### Common Issues

1. **Docker containers not starting:**
   ```bash
   docker compose down
   docker compose up -d --force-recreate
   ```

2. **Database permission errors:**
   ```bash
   chmod 755 database/
   chmod 644 database/time_off_system.db
   ```

3. **n8n not accessible:**
   - Check if port 5678 is available
   - Verify Docker container is running: `docker compose ps`
   - Check logs: `docker compose logs n8n`

4. **Foreign key constraints not working:**
   - Ensure `PRAGMA foreign_keys = ON` is enabled
   - Recreate database: `python3 database/create_sqlite_db.py`

### Logs and Monitoring
```bash
# View all container logs
docker compose logs -f

# View specific service logs
docker compose logs -f n8n
docker compose logs -f mysql

# Check container status
docker compose ps
```

## Sample Data

The system includes sample data for testing:

**Sample Managers:**
- John Manager (john.manager@company.com)
- Sarah Supervisor (sarah.supervisor@company.com)

**Sample Time-Off Requests:**
- Alice Smith: Sep 25-27, 2025 (Vacation)
- Bob Johnson: Oct 1-3, 2025 (Personal time)
- Carol Davis: Oct 15, 2025 (Medical appointment)

**Default Password:** All sample accounts use password `admin123` (hashed)

## Next Steps

After completing this setup:
1. ✅ n8n workflow system is configured and ready
2. ✅ Database tables are created with sample data
3. ✅ Database connectivity is tested and verified
4. ✅ Setup process is documented

**Ready for next story:** Frontend and API development can now begin with the foundational infrastructure in place.

## Security Notes

For production deployment:
- Change default n8n credentials
- Use environment-specific database credentials
- Enable HTTPS for all services
- Implement proper authentication and authorization
- Use MySQL instead of SQLite for production