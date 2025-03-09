import os
import subprocess
import json

# Define paths
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(PROJECT_DIR, "configs")
MODEL_DIR = os.path.join(PROJECT_DIR, "data/models")

# Results storage
results = {}

def check_directory(name, path):
    """Check if a directory exists."""
    exists = os.path.isdir(path)
    results[name] = "✅ Found" if exists else "❌ Missing"
    return exists

def check_file(name, path):
    """Check if a file exists."""
    exists = os.path.isfile(path)
    results[name] = "✅ Found" if exists else "❌ Missing"
    return exists

def check_command(name, command):
    """Run a shell command and check for success."""
    try:
        subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        results[name] = "✅ Passed"
    except subprocess.CalledProcessError as e:
        results[name] = f"❌ Failed: {e.stderr.decode()}"

# Run checks
print("Running project health checks...\n")

# Structure
check_directory("Frontend Directory", os.path.join(PROJECT_DIR, "frontend"))
check_directory("Backend Directory", os.path.join(PROJECT_DIR, "backend"))
check_file("Docker Compose", os.path.join(PROJECT_DIR, "docker-compose.yml"))
check_file("README", os.path.join(PROJECT_DIR, "README.md"))

# Database
check_directory("Configs Directory", CONFIG_DIR)
check_file("MongoDB Config", os.path.join(CONFIG_DIR, "mongodb.conf"))
check_file("PostgreSQL Config", os.path.join(CONFIG_DIR, "postgresql.conf"))

# AI Model Check
if os.path.exists(MODEL_DIR) and os.listdir(MODEL_DIR):
    results["AI Models"] = "✅ Models Found"
else:
    results["AI Models"] = "❌ No models in data/models/"

# Dependency Checks
check_command("Check Python Dependencies", "pip freeze | grep -E 'pymongo|psycopg2-binary'")
check_command("Check Node Dependencies", "npm list")

# Docker
check_command("Docker Installed", "docker --version")
check_command("Docker Compose Config Valid", "docker-compose config")

# Security
check_command("Python Security Audit", "pip-audit")
check_command("Node Security Audit", "npm audit")

# Save results
with open("test_results.json", "w") as f:
    json.dump(results, f, indent=4)

print("\nTest results saved to test_results.json")
