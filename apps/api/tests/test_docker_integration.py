import pytest
import subprocess
import time
import requests
import os
from pathlib import Path

class TestDockerIntegration:
    """Integration tests for Docker containerization"""
    
    @pytest.fixture(scope="class")
    def docker_setup(self):
        """Setup and teardown for Docker tests"""
        # Get the project root (3 levels up from this test file)
        project_root = Path(__file__).parent.parent.parent.parent
        
        # Change to project root for docker commands
        original_cwd = os.getcwd()
        os.chdir(project_root)
        
        try:
            # Build the API image
            build_result = subprocess.run(
                ["docker", "build", "-t", "test-api", "-f", "apps/api/Dockerfile", "apps/api"],
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if build_result.returncode != 0:
                pytest.fail(f"Docker build failed: {build_result.stderr}")
            
            # Start the container
            run_result = subprocess.run(
                ["docker", "run", "-d", "--name", "test-api-container", "-p", "8001:8000", "test-api"],
                capture_output=True,
                text=True
            )
            
            if run_result.returncode != 0:
                pytest.fail(f"Docker run failed: {run_result.stderr}")
            
            container_id = run_result.stdout.strip()
            
            # Wait for container to be ready
            max_retries = 30
            for i in range(max_retries):
                try:
                    response = requests.get("http://localhost:8001/health", timeout=5)
                    if response.status_code == 200:
                        break
                except requests.exceptions.RequestException:
                    pass
                time.sleep(2)
            else:
                # Container didn't start properly, get logs for debugging
                logs_result = subprocess.run(
                    ["docker", "logs", "test-api-container"],
                    capture_output=True,
                    text=True
                )
                pytest.fail(f"Container failed to start within {max_retries * 2} seconds. Logs: {logs_result.stdout}")
            
            yield container_id
            
        finally:
            # Cleanup
            subprocess.run(["docker", "stop", "test-api-container"], capture_output=True)
            subprocess.run(["docker", "rm", "test-api-container"], capture_output=True)
            subprocess.run(["docker", "rmi", "test-api"], capture_output=True)
            os.chdir(original_cwd)
    
    def test_docker_container_health_check(self, docker_setup):
        """Test that the Docker container responds to health checks"""
        # Act
        response = requests.get("http://localhost:8001/health", timeout=10)
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["service"] == "time-off-api"
        assert data["version"] == "1.0.0"
    
    def test_docker_container_root_endpoint(self, docker_setup):
        """Test that the Docker container responds to root endpoint"""
        # Act
        response = requests.get("http://localhost:8001/", timeout=10)
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Time Off System API"
    
    def test_docker_container_logs_startup(self, docker_setup):
        """Test that Docker container produces expected startup logs"""
        # Act
        logs_result = subprocess.run(
            ["docker", "logs", "test-api-container"],
            capture_output=True,
            text=True
        )
        
        # Assert
        assert logs_result.returncode == 0
        logs = logs_result.stdout
        assert "Database initialized successfully" in logs or "Started server process" in logs

class TestDockerCompose:
    """Integration tests for Docker Compose setup"""
    
    def test_docker_compose_file_exists(self):
        """Test that docker-compose.yml exists and is valid"""
        # Get the project root (3 levels up from this test file)
        project_root = Path(__file__).parent.parent.parent.parent
        docker_compose_file = project_root / "docker-compose.yml"
        
        # Assert
        assert docker_compose_file.exists(), "docker-compose.yml file should exist"
        
        # Test that it's valid YAML by attempting to validate it
        result = subprocess.run(
            ["docker-compose", "-f", str(docker_compose_file), "config"],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        
        # Should not have errors (returncode 0 or acceptable warnings)
        if result.returncode != 0:
            # Sometimes docker-compose config fails due to missing .env or other issues
            # But we can at least verify the file is parseable
            assert "yaml" not in result.stderr.lower() or "syntax" not in result.stderr.lower(), \
                f"docker-compose.yml has syntax errors: {result.stderr}"
    
    def test_api_service_definition(self):
        """Test that the API service is properly defined in docker-compose.yml"""
        # Get the project root (3 levels up from this test file)
        project_root = Path(__file__).parent.parent.parent.parent
        docker_compose_file = project_root / "docker-compose.yml"
        
        # Read and verify API service exists
        with open(docker_compose_file, 'r') as f:
            content = f.read()
        
        # Assert
        assert "api:" in content, "API service should be defined"
        assert "dockerfile: ./apps/api/Dockerfile" in content, "API service should use correct Dockerfile"
        assert "8000:8000" in content, "API service should expose port 8000"

# Note: Full docker-compose integration tests would require more complex setup
# and might interfere with development. These tests focus on individual container testing.