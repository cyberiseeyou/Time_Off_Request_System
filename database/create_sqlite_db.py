#!/usr/bin/env python3
"""
SQLite Database Initialization Script for Time Off System
Creates the SQLite database with required tables for MVP
"""

import sqlite3
import os
import hashlib
from pathlib import Path

def create_database():
    """Create SQLite database with required tables"""

    # Create database directory
    db_dir = Path(__file__).parent
    db_path = db_dir / "time_off_system.db"

    # Remove existing database
    if db_path.exists():
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")

    # Create new database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Enable foreign key constraints
    cursor.execute("PRAGMA foreign_keys = ON")

    try:
        # Create managers table
        cursor.execute("""
            CREATE TABLE managers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✓ Created managers table")

        # Create time_off_requests table
        cursor.execute("""
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
            )
        """)
        print("✓ Created time_off_requests table")

        # Create indexes
        cursor.execute("CREATE INDEX idx_time_off_manager_id ON time_off_requests(manager_id)")
        cursor.execute("CREATE INDEX idx_time_off_dates ON time_off_requests(start_date, end_date)")
        cursor.execute("CREATE INDEX idx_managers_email ON managers(email)")
        print("✓ Created indexes")

        # Insert sample data
        # Password hash for 'admin123'
        password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPWfQKRE8TIaG'

        sample_managers = [
            ('John Manager', 'john.manager@company.com', password_hash),
            ('Sarah Supervisor', 'sarah.supervisor@company.com', password_hash)
        ]

        cursor.executemany(
            "INSERT INTO managers (name, email, password_hash) VALUES (?, ?, ?)",
            sample_managers
        )
        print("✓ Inserted sample managers")

        # Insert sample time-off requests
        sample_requests = [
            ('Alice Smith', '2025-09-25', '2025-09-27', 'Vacation', 1),
            ('Bob Johnson', '2025-10-01', '2025-10-03', 'Personal time', 2),
            ('Carol Davis', '2025-10-15', '2025-10-15', 'Medical appointment', 1)
        ]

        cursor.executemany(
            "INSERT INTO time_off_requests (employee_name, start_date, end_date, reason, manager_id) VALUES (?, ?, ?, ?, ?)",
            sample_requests
        )
        print("✓ Inserted sample time-off requests")

        # Commit changes
        conn.commit()
        print(f"✓ Database created successfully: {db_path}")

        # Verify tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"✓ Tables created: {[table[0] for table in tables]}")

        # Count records
        cursor.execute("SELECT COUNT(*) FROM managers")
        manager_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM time_off_requests")
        request_count = cursor.fetchone()[0]

        print(f"✓ Verification: {manager_count} managers, {request_count} time-off requests")

    except Exception as e:
        print(f"✗ Error creating database: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    create_database()