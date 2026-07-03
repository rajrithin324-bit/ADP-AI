from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

def train_regression_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    
    # Feature correlations acting as visual graph coordinate data payloads
    feature_importance = {col: float(val) for col, val in zip(X.columns, model.coef_)}
    
    return {
        "algorithm": "Linear Regression Engine",
        "accuracy_score": max(0.0, round(r2_score(y_test, preds) * 100, 2)),
        "metrics": {
            "R2 Score": round(r2_score(y_test, preds), 4),
            "Mean Absolute Error": round(mean_absolute_error(y_test, preds), 4)
        },
        "chart_data": {
            "labels": list(feature_importance.keys()),
            "values": list(feature_importance.values()),
            "chart_type": "bar",
            "title": "Feature Weight Importance Matrix"
        }
    }
