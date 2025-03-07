import os

# Define the root project directory
project_root = "~/dev/Tata-AI"

# List of directories where requirements.txt should be created
service_directories = [
    "docker/tata-core", 
    "docker/tata-memex", 
    "docker/tata-zkp", 
    "docker/tata-flow"
]

# Example requirements for each module (adjust as needed)
default_requirements = """
flask
requests
numpy
pandas
# Add any other dependencies your project requires
"""

# Function to create requirements.txt in each directory
def generate_requirements_txt():
    for service_dir in service_directories:
        service_path = os.path.expanduser(os.path.join(project_root, service_dir))
        
        # Check if the service directory exists
        if not os.path.exists(service_path):
            print(f"Directory {service_path} does not exist.")
            continue

        # Define the path to the requirements.txt file
        requirements_path = os.path.join(service_path, "requirements.txt")

        # Create the requirements.txt if it doesn't exist
        if not os.path.exists(requirements_path):
            with open(requirements_path, 'w') as f:
                f.write(default_requirements)
            print(f"Created requirements.txt in {service_path}")
        else:
            print(f"requirements.txt already exists in {service_path}")

# Run the script to generate requirements.txt files
generate_requirements_txt()
