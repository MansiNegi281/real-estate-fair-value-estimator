import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

import joblib

df = pd.read_csv("data/housing.csv")

X = df.drop(
    "Price",
    axis=1
)

y = df["Price"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(
    X_train,
    y_train
)

predictions = model.predict(X_test)

score = r2_score(
    y_test,
    predictions
)

print(score)

joblib.dump(

    model,

    "models/house_price_model.pkl"

)

print("Model saved successfully!")