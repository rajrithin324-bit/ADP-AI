from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.database_models import Dataset

router = APIRouter()

@router.get("/reports")
async def get_all_reports(db: Session = Depends(get_db)):
    datasets = db.query(Dataset).all()
    return [{"dataset_id": d.id, "filename": d.filename, "health_report": d.health_report} for d in datasets]
