import random
import string
import os

# Function to generate random strings for passwords or tokens
def generate_random_string(length=16):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Credentials dictionary
credentials = {
    "TATA_CORE_DB_USER": "tata_core_admin",
    "TATA_CORE_DB_PASSWORD": generate_random_string(),
    "HUGGINGFACE_API_TOKEN": generate_random_string(32),
    "POSTGRES_USER": "postgres_user",
    "POSTGRES_PASSWORD": generate_random_string(),
}

# Write to .env file
env_file_path = "/path/to/your/.env"
with open(env_file_path, "w") as env_file:
    for key, value in credentials.items():
        env_file.write(f"{key}={value}\n")

print("✅ Credentials generated and saved to .env")
