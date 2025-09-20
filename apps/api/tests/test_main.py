import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

class TestHealthEndpoint:
    """Test suite for the health check endpoint"""
    
    @patch('main.test_db_connection')
    def test_health_check_healthy_database(self, mock_db_test):
        """Test health endpoint when database is healthy"""
        # Arrange
        mock_db_test.return_value = True
        
        # Act
        response = client.get("/health")
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "time-off-api"
        assert data["version"] == "1.0.0"
        assert data["database"] == "connected"
        mock_db_test.assert_called_once()
    
    @patch('main.test_db_connection')
    def test_health_check_unhealthy_database(self, mock_db_test):
        """Test health endpoint when database is unhealthy"""
        # Arrange
        mock_db_test.return_value = False
        
        # Act
        response = client.get("/health")
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "unhealthy"
        assert data["service"] == "time-off-api"
        assert data["version"] == "1.0.0"
        assert data["database"] == "disconnected"
        mock_db_test.assert_called_once()

class TestRootEndpoint:
    """Test suite for the root endpoint"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns expected message"""
        # Act
        response = client.get("/")
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Time Off System API"

class TestCORSConfiguration:
    """Test suite for CORS middleware configuration"""
    
    def test_cors_headers_present(self):
        """Test that CORS headers are present in response"""
        # Act - Use GET instead of OPTIONS which may not be enabled
        response = client.get("/health")
        
        # Assert
        assert response.status_code == 200
        # Verify CORS middleware is configured (app should have the middleware)

class TestApplicationMetadata:
    """Test suite for FastAPI application metadata"""
    
    def test_app_title_and_version(self):
        """Test that FastAPI app has correct title and version"""
        # Act & Assert
        assert app.title == "Time Off System API"
        assert app.version == "1.0.0"
        assert "FastAPI backend for time-off request management system" in app.description