import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
from app.api import upload, chat, prediction, report, prediction_manager

# Auto create database tables upon server startup initialization
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ADP-AI Multi-Task Predictive Framework Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Mounting Layout Core Setup
app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(prediction.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(prediction_manager.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
