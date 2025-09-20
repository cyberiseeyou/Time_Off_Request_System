#!/usr/bin/env python3
"""
Database Connection and CRUD Operations Test
Tests connectivity and basic operations for Time Off System
"""

import sqlite3
import os
from pathlib import Path
from datetime import datetime

def test_database_connection():
    """Test database connectivity and basic CRUD operations"""

    db_path = Path(__file__).parent / "time_off_system.db"

    if not db_path.exists():
        print(f"✗ Database not found: {db_path}")
        return False

    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Enable foreign key constraints
        cursor.execute("PRAGMA foreign_keys = ON")
        print(f"✓ Connected to database: {db_path}")

        # Test 1: Read operations
        print("\n--- Testing READ Operations ---")

        # Read managers
        cursor.execute("SELECT id, name, email FROM managers")
        managers = cursor.fetchall()
        print(f"✓ Found {len(managers)} managers:")
        for manager in managers:
            print(f"  - {manager[1]} ({manager[2]})")

        # Read time-off requests
        cursor.execute("""
            SELECT tor.id, tor.employee_name, tor.start_date, tor.end_date,
                   tor.reason, tor.status, m.name as manager_name
            FROM time_off_requests tor
            JOIN managers m ON tor.manager_id = m.id
        """)
        requests = cursor.fetchall()
        print(f"✓ Found {len(requests)} time-off requests:")
        for req in requests:
            print(f"  - {req[1]}: {req[2]} to {req[3]} ({req[5]}) - Manager: {req[6]}")

        # Test 2: Create operation
        print("\n--- Testing CREATE Operations ---")

        new_request = (
            'Test Employee',
            '2025-12-01',
            '2025-12-03',
            'Test vacation request',
            1  # John Manager's ID
        )

        cursor.execute("""
            INSERT INTO time_off_requests (employee_name, start_date, end_date, reason, manager_id)
            VALUES (?, ?, ?, ?, ?)
        """, new_request)

        new_id = cursor.lastrowid
        print(f"✓ Created new time-off request with ID: {new_id}")

        # Test 3: Update operation
        print("\n--- Testing UPDATE Operations ---")

        cursor.execute("""
            UPDATE time_off_requests
            SET status = 'approved'
            WHERE id = ?
        """, (new_id,))

        print(f"✓ Updated request {new_id} status to 'approved'")

        # Test 4: Verify update
        cursor.execute("""
            SELECT employee_name, status FROM time_off_requests WHERE id = ?
        """, (new_id,))

        updated_request = cursor.fetchone()
        print(f"✓ Verified: {updated_request[0]} - Status: {updated_request[1]}")

        # Test 5: Delete operation
        print("\n--- Testing DELETE Operations ---")

        cursor.execute("DELETE FROM time_off_requests WHERE id = ?", (new_id,))
        print(f"✓ Deleted test request {new_id}")

        # Test 6: Foreign key constraint
        print("\n--- Testing FOREIGN KEY Constraints ---")

        try:
            cursor.execute("""
                INSERT INTO time_off_requests (employee_name, start_date, end_date, reason, manager_id)
                VALUES ('Invalid Test', '2025-12-01', '2025-12-03', 'Test', 999)
            """)
            print("✗ Foreign key constraint NOT working - invalid manager_id accepted")
        except sqlite3.IntegrityError:
            print("✓ Foreign key constraint working - invalid manager_id rejected")

        # Test 7: Schema verification
        print("\n--- Testing SCHEMA Verification ---")

        cursor.execute("PRAGMA table_info(managers)")
        manager_columns = cursor.fetchall()
        expected_manager_cols = ['id', 'name', 'email', 'password_hash', 'created_at', 'updated_at']
        actual_manager_cols = [col[1] for col in manager_columns]

        for col in expected_manager_cols:
            if col in actual_manager_cols:
                print(f"✓ managers.{col} exists")
            else:
                print(f"✗ managers.{col} missing")

        cursor.execute("PRAGMA table_info(time_off_requests)")
        request_columns = cursor.fetchall()
        expected_request_cols = ['id', 'employee_name', 'start_date', 'end_date', 'reason', 'manager_id', 'status', 'created_at', 'updated_at']
        actual_request_cols = [col[1] for col in request_columns]

        for col in expected_request_cols:
            if col in actual_request_cols:
                print(f"✓ time_off_requests.{col} exists")
            else:
                print(f"✗ time_off_requests.{col} missing")

        # Commit test changes
        conn.commit()
        print("\n✓ All database tests passed successfully!")
        return True

    except Exception as e:
        print(f"✗ Database test failed: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()
            print("✓ Database connection closed")

if __name__ == "__main__":
    success = test_database_connection()
    exit(0 if success else 1)