import json
import os

CONFIG_DIR = "/Volumes/Akron/tata-ai/configs/"
OUTPUT_DIR = "/Volumes/Akron/tata-ai/envs/"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load and merge configurations
def load_config(filename):
    path = os.path.join(CONFIG_DIR, filename)
    if os.path.exists(path):
        with open(path, "r") as file:
            return json.load(file)
    return {}

huggingface = load_config("huggingface_config.json")
monitoring = load_config("monitor_config.json")
postgresql = load_config("postgresql_config.json")

# Generate .env files
env_vars = {
    "HUGGINGFACE_API_TOKEN": huggingface.get("api", {}).get("token", ""),
    "MODEL_REPO": huggingface.get("model_repo", ""),
    "DATASET_REPO": huggingface.get("dataset_repo", ""),
    "GPU_PROVIDER": huggingface.get("gpu", {}).get("provider", ""),
    "POSTGRES_HOST": postgresql.get("postgresql", {}).get("host", ""),
    "POSTGRES_PORT": postgresql.get("postgresql", {}).get("port", ""),
    "POSTGRES_DB": postgresql.get("postgresql", {}).get("database", ""),
    "POSTGRES_USER": postgresql.get("postgresql", {}).get("user", ""),
    "POSTGRES_PASSWORD": postgresql.get("postgresql", {}).get("password", ""),
}

# Write to .env file
env_file = os.path.join(OUTPUT_DIR, ".env")
with open(env_file, "w") as f:
    for key, value in env_vars.items():
        f.write(f"{key}={value}\n")

print(f"✅ Environment file created at {env_file}")s
