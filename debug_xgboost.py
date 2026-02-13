import sys
try:
    import xgboost as xgb
    print("XGBoost imported successfully")
except ImportError as e:
    print(f"Failed to import XGBoost: {e}")
    sys.exit(1)
except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)

import os
import joblib

model_path = os.path.join(os.path.dirname(__file__), 'server/ai_model/model (1).pkl')
# Adjust path to absolute for testing
model_path = '/Users/vishalgautam/Documents/Sam Data/PROJECTS/AI_Sus_Hac/server/ai_model/model (1).pkl'

print(f"Loading model from {model_path}...")
try:
    model = joblib.load(model_path)
    print("Model loaded successfully")
except Exception as e:
    print(f"Failed to load model: {e}")
