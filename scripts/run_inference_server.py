from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# Load model path
with open('public/model_path.txt', 'r') as f:
    model_path = f.read().strip()

# Load model and tokenizer
model = AutoModelForCausalLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

class InferenceRequest(BaseModel):
    text: str

@app.post("/inference")
async def run_inference(request: InferenceRequest):
    try:
        inputs = tokenizer(request.text, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(**inputs, max_length=100)
        result = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to Tata AI Inference API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

