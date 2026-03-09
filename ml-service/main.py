from fastapi import FastAPI  # <- We import FastAPI to create our API service.
from pydantic import BaseModel # <- We import BaseModel from Pydantic to define our data models for request validation.

# Import ML Functions
from model import (
    predict_next_score,
    detect_trend,
    detect_sudden_drop,
    calculate_fail_probability,
    get_predicted_grade,
    generate_insights
)


# We create a FastAPI instance to define our API endpoints and handle requests.
# creates API  Server
app = FastAPI()

# We define a Pydantic model to validate the input data for the /predict endpoint.
class ScoreInput(BaseModel):
    scores: list[float]


#  define a simple root endpoint to check if the service is running.
@app.get("/")
def root():
    return {"message": "ML Service Running"}

# The /predict endpoint takes a list of scores as input, 
# performs various analyses, and returns a comprehensive  
# response with the predicted next score, predicted grade,
# fail probability, trend, sudden drop detection, and insights
@app.post("/predict")
def predict(data: ScoreInput):

    scores = data.scores

    if len(scores) < 2:
        return {"error": "Not enough data"}

    # We call the functions defined in model.py to perform the necessary calculations and analyses.
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