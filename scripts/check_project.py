import os

# List of important directories and files to check
expected_directories = [
    "/Volumes/akron/Tata-ai/backend",
    "/Volumes/akron/Tata-ai/frontend",
    "/Volumes/akron/Tata-ai/data",
    "/Volumes/akron/Tata-ai/docker",
    "/Volumes/akron/Tata-ai/logs",
    "/Volumes/akron/Tata-ai/tests"
]

expected_files = [
    "/Volumes/akron/Tata-ai/docker-compose.yml",
    "/Volumes/akron/Tata-ai/README.md",
    "/Volumes/akron/Tata-ai/bootstrap.sh"
]

# Check directories
def check_directories():
    for directory in expected_directories:
        if not os.path.exists(directory):
            print(f"Directory missing: {directory}")
        else:
            print(f"Directory exists: {directory}")

# Check files
def check_files():
    for file in expected_files:
        if not os.path.isfile(file):
            print(f"File missing: {file}")
        else:
            print(f"File exists: {file}")

# Check if the language models are in the correct folder
def check_language_models():
    models_dir = "/Volumes/akron/Tata-ai/data/models"
    if not os.path.isdir(models_dir):
        print(f"Language models directory missing: {models_dir}")
    else:
        print(f"Language models directory exists: {models_dir}")
        _files = os.listdir(models_dir)
        if _files:
            print(f"Models found in {models_dir}: {_files}")
        else:
            print(f"No models found in {models_dir}")

# Run checks
check_directories()
check_files()
check_language_models()
