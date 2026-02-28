from fastapi import FastAPI
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI()

@app.post("/predict")
def predict_performance(data: dict):
    try:
        scores = data.get("scores", [])

        if len(scores) < 2:
            return {"error": "Not enough data for prediction"}

        X = np.array(range(1, len(scores) + 1)).reshape(-1, 1)
        y = np.array(scores)

        model = LinearRegression()
        model.fit(X, y)

        next_exam = np.array([[len(scores) + 1]])
        prediction = model.predict(next_exam)[0]

        risk = "LOW"
        if prediction < 40:
            risk = "HIGH"
        elif prediction < 60:
            risk = "MEDIUM"

        return {
            "predictedScore": round(float(prediction), 2),
            "riskLevel": risk
        }

    except Exception as e:
        return {"error": str(e)}