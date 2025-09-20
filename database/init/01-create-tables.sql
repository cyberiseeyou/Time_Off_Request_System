-- Initialize Time Off System Database
-- This script creates the required tables for the time-off system

-- Create managers table
CREATE TABLE IF NOT EXISTS managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create time_off_requests table
CREATE TABLE IF NOT EXISTS time_off_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    manager_id INT NOT NULL,
    status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE CASCADE
);

-- Insert sample data for testing
INSERT INTO managers (name, email, password_hash) VALUES
('John Manager', 'john.manager@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPWfQKRE8TIaG'),
('Sarah Supervisor', 'sarah.supervisor@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPWfQKRE8TIaG');

-- Add indexes for performance
CREATE INDEX idx_time_off_manager_id ON time_off_requests(manager_id);
CREATE INDEX idx_time_off_dates ON time_off_requests(start_date, end_date);
CREATE INDEX idx_managers_email ON managers(email);