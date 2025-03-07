#!/usr/bin/env python3
import subprocess
import time
import socket

def check_dependency(cmd, name):
    """Checks if a required dependency is installed."""
    try:
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        print(f"[OK] {name} is installed.")
    except subprocess.CalledProcessError:
        print(f"[ERROR] {name} is missing. Install it and retry.")
        return False
    return True

def check_service(host, port, name, retries=5, delay=5):
    """Checks if a service is running."""
    for attempt in range(retries):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        try:
            sock.connect((host, port))
            print(f"[OK] {name} is running on {host}:{port}.")
            sock.close()
            return True
        except:
            print(f"[WARNING] {name} is NOT running on {host}:{port}. Retrying ({attempt + 1}/{retries})...")
            time.sleep(delay)
    print(f"[ERROR] {name} is NOT responding after multiple attempts.")
    return False

def full_self_check():
    """Runs all necessary checks and returns status."""
    print("Checking system dependencies...")
    deps = {
        "Docker": ["docker", "--version"],
        "Docker Compose": ["docker-compose", "--version"],
        "Python 3": ["python3", "--version"]
    }
    for name, cmd in deps.items():
        if not check_dependency(cmd, name):
            return 1  # Dependency missing
    
    print("Checking Tata AI service connectivity...")
    services = {
        "Tata-CORE": 5001,
        "Tata-MEMEX": 5002,
        "Tata-ZKP": 5003,
        "Tata-FLOW": 5004,
        "Tata-MOTO": 5005
    }
    
    missing_services = [name for name, port in services.items() if not check_service("localhost", port, name)]
    
    if missing_services:
        print(f"[WARNING] Services not running: {', '.join(missing_services)}")
        return 2  # Some services are down
    
    print("[SUCCESS] Tata AI is fully verified and running.")
    return 0  # All checks passed

if __name__ == "__main__":
    exit(full_self_check())
