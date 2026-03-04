from fastapi import FastAPI
from pydantic import BaseModel
from model import predict_next_score


app = FastAPI()

class ScoreInput(BaseModel):
    scores: list[float]

@app.get("/")
def root():
    return {"message": "ML Service Running"}

@app.post("/predict")
def predict(data: ScoreInput):

    scores = data.scores

    if len(scores) < 2:
        return {"error": "Not enough data"}

    # Call ML model from model.py
    prediction = predict_next_score(scores)

    risk_level = "LOW"
    if prediction < 50:
        risk_level = "HIGH"
    elif prediction < 70:
        risk_level = "MEDIUM"

    return {
        "predictedScore": prediction,
        "riskLevel": risk_level
    }