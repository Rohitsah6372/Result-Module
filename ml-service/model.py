import numpy as np
from sklearn.linear_model import LinearRegression


def predict_next_score(scores):

    if len(scores) < 2:
        raise ValueError("At least two scores required")

    # Rolling average smoothing
    if len(scores) >= 3:
        scores = np.convolve(scores, np.ones(3)/3, mode='valid')

    X = np.array(range(len(scores))).reshape(-1, 1)
    y = np.array(scores)

    model = LinearRegression()
    model.fit(X, y)

    next_exam = np.array([[len(scores)]])
    prediction = model.predict(next_exam)[0]

    prediction = max(0, min(100, prediction))

    return round(float(prediction), 2)


def detect_trend(scores):

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

    prev = scores[-2]
    last = scores[-1]

    drop_percent = ((prev - last) / prev) * 100

    return drop_percent > 20


def calculate_fail_probability(score):

    probability = max(0, min(1, (40 - score) / 40))

    return round(float(probability), 2)


def get_predicted_grade(score):

    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    elif score >= 50:
        return "E"
    else:
        return "F"


def generate_insights(scores, prediction):

    insights = []

    trend = detect_trend(scores)
    sudden_drop = detect_sudden_drop(scores)

    if trend == "UPWARD":
        insights.append("Student performance trend is improving.")

    if trend == "DOWNWARD":
        insights.append("Student performance trend is declining.")

    if sudden_drop:
        insights.append("Recent score dropped by more than 20%.")

    if prediction < 40:
        insights.append("High risk of failing next exam.")

    if prediction < 60:
        insights.append("Student may require additional practice.")

    if prediction >= 80:
        insights.append("Student is performing very well.")

    if len(insights) == 0:
        insights.append("Performance appears stable.")

    return insights