from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
import numpy as np

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

    # Prepare training data
    X = np.array(range(len(scores))).reshape(-1, 1)
    y = np.array(scores)

    model = LinearRegression()
    model.fit(X, y)

    # Predict next exam score
    next_exam = np.array([[len(scores)]])
    prediction = model.predict(next_exam)[0]

    risk_level = "LOW"
    if prediction < 50:
        risk_level = "HIGH"
    elif prediction < 70:
        risk_level = "MEDIUM"

    return {
        "predictedScore": round(float(prediction), 2),
        "riskLevel": risk_level
    }