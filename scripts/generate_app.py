import os

# Define the root project directory
project_root = os.path.expanduser("~/dev/Tata-AI")

# List of directories where app.py should be created
service_directories = [
    "src/tata-core", 
    "src/tata-memex", 
    "src/tata-zkp", 
    "src/tata-flow"
]

# Basic content for the app.py file for each service
app_code = """# app.py for {service_name}
print("{service_name} Service Running...")
# Add actual application logic here
"""

# Function to generate app.py for each service
def generate_app_py():
    for service_dir in service_directories:
        service_name = service_dir.split("/")[-1]  # Extract the service name (tata-core, tata-memex, etc.)
        service_path = os.path.join(project_root, service_dir)
        
        # Check if the service directory exists
        if not os.path.exists(service_path):
            print(f"Directory {service_path} does not exist.")
            continue

        # Define the path for the app.py file
        app_path = os.path.join(service_path, "app.py")

        # Create app.py if it doesn't exist
        if not os.path.exists(app_path):
            with open(app_path, 'w') as f:
                f.write(app_code.format(service_name=service_name))
            print(f"Created app.py in {service_path}")
        else:
            print(f"app.py already exists in {service_path}")

# Run the script to generate app.py files
generate_app_py()
