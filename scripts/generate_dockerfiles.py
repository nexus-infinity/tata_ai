import os

# Define the root directory for your project
project_root = "~/dev/Tata-AI"

# List of directories where Dockerfiles need to be generated
service_directories = [
    "docker/tata-core", 
    "docker/tata-memex", 
    "docker/tata-zkp", 
    "docker/tata-flow"
]

# Dockerfile content template
dockerfile_content = """# Use an appropriate base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install dependencies (if any)
RUN pip install --no-cache-dir -r requirements.txt

# Command to run the application (replace with the actual command)
CMD ["python", "app.py"]
"""

# Function to create Dockerfiles
def generate_dockerfiles():
    for service_dir in service_directories:
        service_path = os.path.expanduser(os.path.join(project_root, service_dir))
        if not os.path.exists(service_path):
            print(f"Directory {service_path} does not exist.")
            continue

        dockerfile_path = os.path.join(service_path, "Dockerfile")
        # Create the Dockerfile if it doesn't exist
        if not os.path.exists(dockerfile_path):
            with open(dockerfile_path, 'w') as f:
                f.write(dockerfile_content)
            print(f"Created Dockerfile in {service_path}")
        else:
            print(f"Dockerfile already exists in {service_path}")

# Run the script to generate the Dockerfiles
generate_dockerfiles()
