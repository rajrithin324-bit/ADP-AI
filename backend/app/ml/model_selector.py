import pandas as pd
import numpy as np
from app.ml.preprocessing import clean_and_split_pipeline
from app.ml.regression import train_regression_model
from app.ml.classification import train_classification_model
from app.ml.clustering import train_clustering_model
from app.ml.forecasting import train_forecasting_model

class AutoModelSelector:
    @staticmethod
    def map_intent_and_train(file_path: str, target_column: str, discovered_intent: str) -> dict:
        df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
        
        if discovered_intent == "clustering":
            return train_clustering_model(df)
            
        if target_column not in df.columns:
            raise ValueError(f"Target vector parameter '{target_column}' is missing from the active dataset columns.")
            
        X, y = clean_and_split_pipeline(df, target_column)
        
        if discovered_intent == "forecasting":
            return train_forecasting_model(df, target_column)
        elif discovered_intent == "classification" or (y.dtype == 'object' or y.nunique() < 15):
            return train_classification_model(X, y)
        else:
            return train_regression_model(X, y)
