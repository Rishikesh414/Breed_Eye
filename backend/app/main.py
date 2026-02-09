from fastapi import FastAPI
from .routes.predict import router

app = FastAPI(
    title="Breed Eye – AI Breed Identification System",
    version="1.0",
    docs_url="/docs",  # Enable Swagger UI
    redoc_url="/redoc"  # Enable ReDoc
)

app.include_router(router)
