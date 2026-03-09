import numpy as np
from sklearn.linear_model import LinearRegression


def predict_next_score(scores):

    if len(scores) < 2:
        raise ValueError("At least two scores required")

    # Rolling average smoothing
    """
    This helps the linear regression model to make
    more accurate predictions by reducing noise in the data.
    The np.convolve function is used to compute the rolling average, 
    where np.ones(3)/3 creates a kernel of size 3 that averages the values,
    and mode='valid' ensures that we only get the valid part of the convolution,
    which corresponds to the smoothed scores.    
    """
    if len(scores) >= 3:
        scores = np.convolve(scores, np.ones(3)/3, mode='valid')

    """
    We use a simple linear regression model to predict the next score based on the historical scores.
    The model is trained on the indices of the scores (0, 1, 2, ...) 
    as the independent variable (X) and the scores themselves as the dependent variable (y).       
    """
    X = np.array(range(len(scores))).reshape(-1, 1)

    """
    After fitting the model, we predict the next score by providing the index of the next exam (len(scores))
    as input to the model. The prediction is then clipped to be between 0 and 100 to ensure 
    it falls within a valid score range, and rounded to two decimal places for better readability.          
    """
    y = np.array(scores)

    # We create and fit the linear regression model using the historical scores.
    model = LinearRegression()
    #   The fit method trains the linear regression model on the provided data (X and y),
    #   allowing it to learn the relationship between the indices and the scores.
    model.fit(X, y)

    # We predict the next score by providing the index of the next exam (len(scores)) as input to the model.
    next_exam = np.array([[len(scores)]])
    # The predict method uses the trained model to predict the next score based on the input index. 
    prediction = model.predict(next_exam)[0]

    # We ensure the predicted score is between 0 and 100, and round it to two decimal places for better readability.
    prediction = max(0, min(100, prediction))

    return round(float(prediction), 2)




"""
The detect_trend function analyzes the historical scores to determine 
if there is an upward, downward, or stable trend in the student's performance.
It fits a linear regression model to the scores and examines the slope of the fitted line.
- If the slope is greater than 1, it indicates an upward trend.
- If the slope is less than -1, it indicates a downward trend.
- If the slope is between -1 and 1, it indicates a stable trend.    
"""
def detect_trend(scores):

    # We fit a linear regression model to the scores and examine the slope of the fitted line.
    X = np.array(range(len(scores))).reshape(-1, 1)
    # The fit method trains the linear regression model on the provided data (X and y),
    y = np.array(scores)

    # We create and fit the linear regression model using the historical scores.
    model = LinearRegression()
    #   The fit method trains the linear regression model on the provided data (X and y),
    #   allowing it to learn the relationship between the indices and the scores.
    model.fit(X, y)

    # We examine the slope of the fitted line to determine the trend in the student's performance.
    slope = model.coef_[0]

    if slope > 1:
        return "UPWARD"
    elif slope < -1:
        return "DOWNWARD"
    else:
        return "STABLE"


"""
The detect_sudden_drop function checks if there has been a sudden drop in the student's performance
by comparing the last two scores. It calculates the percentage drop from the previous score to the 
last score and returns True if the drop is greater than 20%, indicating a significant decline in performance.    
"""
def detect_sudden_drop(scores):

    if len(scores) < 2:
        return False

    # We calculate the percentage drop from the previous score to the last score and 
    # return True if the drop is greater than 20%, indicating a significant decline in performance.  
    prev = scores[-2]

    # The drop_percent variable calculates the percentage drop from the previous score to the last score using the formula:
    # drop_percent = ((prev - last) / prev) * 100
    last = scores[-1]

    # The drop_percent variable calculates the percentage drop from the previous score to the last score using the formula: 
    drop_percent = ((prev - last) / prev) * 100

    return drop_percent > 20



"""
The calculate_fail_probability function estimates the probability of the student 
failing the next exam based on the predicted score.
    - If the predicted score is 40 or above, the fail probability is 0 (indicating no risk of failing).
    - If the predicted score is below 40, the fail probability increases linearly as the score decreases,
    reaching a maximum of 1 (indicating certain failure) at a score of 0. The function ensures that the 
    calculated probability is between 0 and 1
"""
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


"""
The generate_insights function generates insights based on the historical scores and the predicted next score.
"""
def generate_insights(scores, prediction):
    # We initialize an empty list to store the insights that will be 
    # generated based on the analysis of the scores and the predicted score.
    insights = []

    # We call the detect_trend and detect_sudden_drop functions 
    # to analyze the scores and determine if there is an upward or downward trend,
    # and if there has been a sudden drop in performance. 
    # Based on these analyses, we generate insights that provide feedback on the student's
    # performance and potential areas of concern or improvement.
    trend = detect_trend(scores)

    # We call the detect_trend and detect_sudden_drop functions to analyze
    # the scores and determine if there is an upward or downward trend,
    # and if there has been a sudden drop in performance. Based on these analyses, 
    # we generate insights that provide feedback on the student's performance and potential areas of concern or improvement.
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