from fastapi import FastAPI
from pydantic import BaseModel

from model import (
    predict_next_score,
    detect_trend,
    detect_sudden_drop,
    calculate_fail_probability,
    get_predicted_grade,
    generate_insights
)

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

    prediction = predict_next_score(scores)

    trend = detect_trend(scores)

    sudden_drop = detect_sudden_drop(scores)

    fail_probability = calculate_fail_probability(prediction)

    grade = get_predicted_grade(prediction)

    insights = generate_insights(scores, prediction)

    return {
        "predictedScore": prediction,
        "predictedGrade": grade,
        "failProbability": fail_probability,
        "trend": trend,
        "suddenDropDetected": sudden_drop,
        "insights": insights
    }