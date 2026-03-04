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