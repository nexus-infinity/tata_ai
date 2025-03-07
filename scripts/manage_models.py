import os
import json

class ModelManager:
    def __init__(self, models_dir):
        self.models_dir = models_dir

    def load_model(self, model_name, version):
        model_path = os.path.join(self.models_dir, model_name, f"model-v{version}.bin")
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                return f.read()
        else:
            raise FileNotFoundError(f"Model {model_name} v{version} not found.")

    def get_model_versions(self, model_name):
        model_path = os.path.join(self.models_dir, model_name)
        if os.path.exists(model_path):
            return [f for f in os.listdir(model_path) if f.startswith('model-v')]
        else:
            return []

# Usage
model_manager = ModelManager("/data/models/")
model_data = model_manager.load_model("llama-3.1", "v1.0")
print(model_data)
