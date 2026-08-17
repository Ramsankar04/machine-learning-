from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("random_forest_model.pkl")

# Load feature columns
feature_columns = joblib.load("feature_columns.pkl")


@app.route("/")
def home():
    return "Network Intrusion Detection Backend is Running!"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    # Create DataFrame from received data
    input_data = pd.DataFrame([data])

    # Convert categorical values into columns
    input_data = pd.get_dummies(input_data)

    # Match the exact columns used during training
    input_data = input_data.reindex(
        columns=feature_columns,
        fill_value=0
    )

    # Make prediction
    prediction = model.predict(input_data)[0]

    if prediction == 0:
        result = "NORMAL"
    else:
        result = "INTRUSION"

    return jsonify({
        "prediction": result
    })


if __name__ == "__main__":
    app.run(debug=True)