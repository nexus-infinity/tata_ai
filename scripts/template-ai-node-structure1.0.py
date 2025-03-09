import json
import os

# Path to credentials and template files
env_file_path = "/path/to/your/.env"
template_file_path = "/path/to/your/template-ai-node-credentials.json"
output_file_path = "/path/to/your/populated-template.json"

# Function to load credentials from .env file
def load_credentials(env_file_path):
    credentials = {}
    with open(env_file_path, "r") as f:
        for line in f:
            key, value = line.strip().split("=")
            credentials[key] = value
    return credentials

# Function to populate JSON template with credentials
def populate_template(template_file_path, credentials):
    with open(template_file_path, "r") as f:
        template = json.load(f)

    # Replace placeholders with actual credentials
    template["credentials"]["database"]["host"] = credentials.get("DB_HOST", "localhost")
    template["credentials"]["database"]["password"] = credentials.get("POSTGRES_PASSWORD", "")
    template["credentials"]["database"]["username"] = credentials.get("POSTGRES_USER", "")
    template["credentials"]["database"]["name"] = credentials.get("TATA_CORE_DB_NAME", "tata_core_db")
    
    # Other fields can be populated similarly...

    # Save the populated template to a new file
    with open(output_file_path, "w") as f:
        json.dump(template, f, indent=4)

    print(f"✅ Template populated and saved to {output_file_path}")

# Load credentials from .env
credentials = load_credentials(env_file_path)

# Populate the template with the loaded credentials
populate_template(template_file_path, credentials)
