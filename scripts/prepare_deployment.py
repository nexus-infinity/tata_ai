import os
import json
from huggingface_hub import HfApi, snapshot_download

def prepare_deployment():
    # Load Hugging Face config
    with open('configs/huggingface_config.json', 'r') as f:
        hf_config = json.load(f)

    # Download the latest model
    model_path = snapshot_download(repo_id=hf_config['model_repo'])
    
    # Create a public directory for static files if it doesn't exist
    os.makedirs('public', exist_ok=True)
    
    # Create a file with the model path for the inference server to use
    with open('public/model_path.txt', 'w') as f:
        f.write(model_path)

    print("Deployment preparation complete.")

if __name__ == "__main__":
    prepare_deployment()

