from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Load model and tokenizer
model_name = "bhadresh-savani/bert-base-go-emotion"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Create inference pipeline
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer, return_all_scores=True)

# Define FastAPI app
app = FastAPI()

# Request body model
class TextInput(BaseModel):
    text: str

# Root endpoint (optional)
@app.get("/")
def read_root():
    return {"message": "Emotion classification API is running."}

# Inference endpoint
@app.post("/classify")
def classify_emotion(input_data: TextInput):
    results = classifier(input_data.text)
    return {"results": results[0]}  # return scores for each emotion