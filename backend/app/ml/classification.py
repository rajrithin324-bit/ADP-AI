from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split

def train_classification_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    
    importance = {col: float(val) for col, val in zip(X.columns, model.feature_importances_)}
    
    return {
        "algorithm": "Random Forest Classifier",
        "accuracy_score": round(accuracy_score(y_test, preds) * 100, 2),
        "metrics": {
            "Accuracy": round(accuracy_score(y_test, preds), 4),
            "F1 Score (Weighted)": round(f1_score(y_test, preds, average='weighted'), 4)
        },
        "chart_data": {
            "labels": list(importance.keys()),
            "values": list(importance.values()),
            "chart_type": "horizontalBar",
            "title": "Random Forest Gini Feature Splits"
        }
    }
