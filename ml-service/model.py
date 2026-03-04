import numpy as np
from sklearn.linear_model import LinearRegression

def predict_next_score(scores):

    if len(scores) < 2:
        raise ValueError("At least two scores are required to make a prediction.")

    X = np.array(range(len(scores))).reshape(-1, 1)
    y = np.array(scores)

    model = LinearRegression()
    model.fit(X, y)

    next_time_step = np.array([[len(scores)]])
    predicted_score = model.predict(next_time_step)[0]

    # Keep score within valid range
    predicted_score = max(0, min(100, predicted_score))

    return round(float(predicted_score), 2)



def detect_trend(scores):

    if len(scores) < 2:
        return "STABLE"

    X = np.array(range(len(scores))).reshape(-1, 1)
    y = np.array(scores)

    model = LinearRegression()
    model.fit(X, y)

    slope = model.coef_[0]

    if slope > 1:
        return "UPWARD"
    elif slope < -1:
        return "DOWNWARD"
    else:
        return "STABLE"



def detect_sudden_drop(scores):

    if len(scores) < 2:
        return False

    last = scores[-1]
    prev = scores[-2]

    drop = ((prev - last) / prev) * 100

    return drop > 20



def calculate_risk(predicted_score):

    if predicted_score < 40:
        return "HIGH"
    elif predicted_score < 70:
        return "MEDIUM"
    else:
        return "LOW"