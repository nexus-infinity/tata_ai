import os

# Define the existing project folder
root_dir = "~/dev/Tata-AI"

# Files content to be generated
files = {
    "README.md": """# Tata AI Project

Tata AI is a modular AI system designed to handle decision-making, knowledge management, security, and dynamic resource management using Docker containers.

## Folder Structure

- `docker/`: Contains Dockerfiles and configurations for each module.
- `docs/`: Documentation for setup, usage, and architecture.
- `src/`: Source code for the four core modules.
- `tests/`: Unit and integration tests for all modules.
- `configs/`: Configuration files for each module.
- `scripts/`: Automation scripts.
- `logs/`: Log files generated during runtime.
- `data/`: Raw and processed data.

## Setup Instructions

1. Clone the repository.
2. Run `docker-compose up` to start the containers.
3. Configure environment variables as necessary.
4. Use the APIs to interact with the modules.

## Usage

Each module can be accessed via HTTP APIs defined in `tata-core`, `tata-memex`, `tata-zkp`, and `tata-flow`.
""",

    "docker-compose.yml": """version: '3.8'
services:
  tata-core:
    build: ./docker/tata-core
    ports:
      - "8000:8000"
    networks:
      - tata-network
  tata-memex:
    build: ./docker/tata-memex
    networks:
      - tata-network
  tata-zkp:
    build: ./docker/tata-zkp
    networks:
      - tata-network
  tata-flow:
    build: ./docker/tata-flow
    networks:
      - tata-network

networks:
  tata-network:
    driver: bridge
""",

    "docs/architecture.md": """# Tata AI Architecture

Tata AI consists of four primary modules: Tata-CORE, Tata-MEMEX, Tata-ZKP, and Tata-FLOW. Each module is containerized using Docker and communicates over a secure network.

The core components interact with each other via HTTP APIs and support dynamic resource management using Kubernetes or Docker Swarm.
""",

    "docs/setup.md": """# Setup Instructions

To set up the Tata AI environment locally:

1. Clone the repository
2. Run `docker-compose up` to build and start all containers
3. Configure any necessary environment variables (see `configs/`)
4. Test using `curl` or Postman by sending requests to the exposed services.

## Required Tools
- Docker
- Docker Compose
""",

    "docs/usage.md": """# Usage

Each module provides an HTTP API endpoint:
- Tata-CORE: Decision-making engine (e.g., POST to `/api/decision`)
- Tata-MEMEX: Knowledge management (e.g., GET `/api/graph`)
- Tata-ZKP: Zero-Knowledge Proofs for secure data validation (e.g., POST `/api/zkp`)
- Tata-FLOW: Resource management and dynamic scaling (e.g., GET `/api/flow`)

Use Postman or `curl` to test and interact with these APIs.
""",

    "scripts/build.sh": """#!/bin/bash
# Build Docker containers for all modules
docker-compose build
""",

    "scripts/deploy.sh": """#!/bin/bash
# Deploy the latest version to the cloud or production
docker-compose push
""",

    "scripts/setup_env.sh": """#!/bin/bash
# Setup environment variables for Docker containers
export TATA_CORE_ENV=production
export TATA_MEMEX_ENV=production
export TATA_ZKP_ENV=production
export TATA_FLOW_ENV=production
""",

    "scripts/run_tests.sh": """#!/bin/bash
# Run tests across all modules
pytest tests/tata-core/
pytest tests/tata-memex/
pytest tests/tata-zkp/
pytest tests/tata-flow/
""",

    # Including content from bear-algorithm.json for evaluation parameters
    "configs/evaluation_parameters.json": """{
    "EvaluationParameters": {
        "patternRecognitionStrength": {
            "description": "Ability to detect and interpret patterns in data",
            "metricType": "score",
            "value": 0,
            "maxValue": 100,
            "weight": 1.0
        },
        "cognitiveAdaptability": {
            "description": "Ability to adapt to new scenarios or changes based on input",
            "metricType": "score",
            "value": 0,
            "maxValue": 100,
            "weight": 1.0
        },
        "ethicalConsiderations": {
            "description": "Adherence to ethical guidelines and avoidance of biases",
            "criteria": ["bias", "privacy", "transparency"],
            "complianceLevel": 0,
            "maxLevel": 100,
            "weight": 1.0
        },
        "efficiencyAccuracyTradeOff": {
            "description": "Balance between efficiency (speed/resources) and accuracy",
            "accuracyPriority": 0.5,
            "efficiencyPriority": 0.5
        }
    }
}
"""
}

# Function to create the project files and folders
def create_project_files(root_dir):
    # Create the directories if not already present
    os.makedirs(root_dir, exist_ok=True)
    
    # Loop through the files and write the content to them
    for file, content in files.items():
        file_path = os.path.join(root_dir, file)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(content)
    
    print(f"Project files created successfully at {root_dir}")

# Run the script to generate files without nesting
root_dir = os.path.expanduser("~/dev/Tata-AI")
create_project_files(root_dir)
