from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.database_models import Dataset
from app.ml.model_selector import AutoModelSelector

router = APIRouter()

class DirectPredictPayload(BaseModel):
    file_id: str
    target_column: str
    task_type: str  # 'regression' | 'classification' | 'clustering'

@router.post("/predict")
async def execute_explicit_prediction(payload: DirectPredictPayload, db: Session = Depends(get_db)):
    record = db.query(Dataset).filter(Dataset.id == payload.file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Dataset records invalid.")
    try:
        results = AutoModelSelector.map_intent_and_train(record.file_path, payload.target_column, payload.task_type)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
