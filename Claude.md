# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Setup and Installation
```bash
# Initial setup - runs complete installation and starts server
python crossmark_complete_setup.py

# Install dependencies only
pip install -r crossmark_requirements.txt

# Create virtual environment (if needed)
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```

### Running the Application
```bash
# Start the web server
python crossmark_web_app.py

# Run database sync manually
python crossmark_test_script.py

# Access web interface
# Open browser to http://localhost:5000
```

### Testing and Development
```bash
# Check database integrity
sqlite3 crossmark_events.db ".tables"
sqlite3 crossmark_events.db "SELECT COUNT(*) FROM events;"

# View logs
tail -f crossmark_complete.log

# Test API authentication
python -c "from crossmark_session import CrossmarkSession; s = CrossmarkSession(); print(s.authenticate('USERNAME', 'PASSWORD'))"
```

## Architecture Overview

### Core Components

**crossmark_session.py** - API Session Handler
- Custom `CrossmarkSession` class extending `requests.Session`
- Handles authentication with Crossmark API
- Methods: `authenticate()`, `get_scheduled_events()`, `get_unscheduled_events()`
- Auto-retry logic and session management

**crossmark_test_script.py** - Database Manager
- `EnhancedDatabaseManager` class for SQLite operations
- `SmartScheduler` class for background sync operations
- Event synchronization with deduplication
- Database schema initialization and migration

**employee_scheduler.py** - Scheduling Logic
- `EmployeeManager` class for employee CRUD operations
- `SmartScheduler` class for automated event assignment
- Skill matching algorithm (CORE, SUPERVISOR, DIGITAL, JUICER)
- Availability checking and conflict prevention
- Weekly hours tracking

**crossmark_web_app.py** - Flask Web Application
- REST API endpoints under `/api/`
- Template rendering for web UI
- Integration with scheduling and database managers
- CORS enabled for external access

**crossmark_complete_setup.py** - Setup Script
- One-command installation and configuration
- Creates directory structure (`templates/`, `static/`, `logs/`)
- Generates HTML templates
- Initializes database with sample data

### Database Schema

**events** table
- Stores all events from Crossmark API
- Tracks scheduling status and assignments
- Unique constraint on event_id prevents duplicates

**employees** table
- Employee profiles with skills and availability
- JSON fields for skills array and availability schedule
- Tracks max weekly hours and current assignments

**schedule** table
- Links employees to events (many-to-many)
- Prevents double-booking with unique constraints
- Status tracking (scheduled, confirmed, completed)

**sync_log** table
- Audit trail of all sync operations
- Performance metrics and error tracking

### Event Scheduling Rules

1. **CORE Events**: Each employee may only work 1 CORE event on any given day
2. **Lead Requirements**: Leads scheduled for Freeosk, Digital, or Supervisor events MUST have a CORE event that day
3. **Skill Matching**: Employees are assigned based on their skills matching event requirements
4. **Availability**: Respects employee working hours and days off
5. **Hours Balance**: Distributes hours evenly among available employees

### API Integration

The system integrates with Crossmark API at `https://crossmark.mvretail.com`:
- Authentication endpoint: `/api/auth/login`
- Scheduled events: `/api/work/myevents/scheduled`
- Unscheduled events: `/api/work/myevents/unscheduled`

Uses timezone: `America/Indiana/Indianapolis`

### Key Configuration (.env)

```env
CROSSMARK_USERNAME=mat.conder8135
CROSSMARK_PASSWORD=Password123!
DATABASE_PATH=crossmark_events.db
SYNC_INTERVAL_MINUTES=5
SYNC_LOOKBACK_DAYS=14
SYNC_LOOKAHEAD_DAYS=30
PORT=5000
```

### Important Notes

- The Club Supervisor is the primary user - references to "me" mean Club Supervisor
- Use `get_available_employees` tool only for looking up employee IDs for scheduling
- Background sync runs every 5 minutes when `SmartScheduler.start()` is called
- All datetime operations use the configured timezone
- Employee availability is stored as JSON in the database
- The system maintains a complete audit trail in `sync_log` table