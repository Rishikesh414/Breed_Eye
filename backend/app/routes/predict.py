from fastapi import APIRouter, UploadFile, HTTPException, BackgroundTasks
import shutil
import tempfile
import os
import asyncio
from ..services.inference import predict
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def cleanup_temp_file(temp_path: str):
    """Background task to clean up temporary file"""
    try:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
            logger.debug(f"Cleaned up temp file: {temp_path}")
    except Exception as e:
        logger.warning(f"Failed to clean up temp file {temp_path}: {str(e)}")

@router.post("/predict")
async def predict_route(file: UploadFile, background_tasks: BackgroundTasks):
    temp_path = None
    try:
        # Create temp file synchronously for file upload
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        logger.info(f"Processing prediction for file: {file.filename}")

        # Run prediction in a thread pool to avoid blocking the event loop
        result = await asyncio.to_thread(predict, temp_path)

        logger.info("Prediction completed successfully")

        # Schedule cleanup in background
        background_tasks.add_task(cleanup_temp_file, temp_path)

        return result

    except ValueError as e:
        if "Invalid or unreadable image" in str(e):
            logger.warning(f"Invalid image file uploaded: {file.filename}")
            raise HTTPException(status_code=400, detail="Invalid image file. Please upload a valid image.")
        # Log the specific error for debugging
        logger.error(f"ValueError during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    except FileNotFoundError as e:
        logger.error(f"File not found error: {str(e)}")
        raise HTTPException(status_code=500, detail="Model file not found. Please check model configuration.")
    except RuntimeError as e:
        logger.error(f"Runtime error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Model inference failed. Please try again.")
    except Exception as e:
        logger.error(f"Unexpected error during prediction: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during prediction")
    finally:
        # If something went wrong before scheduling cleanup, clean up immediately
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception as e:
                logger.warning(f"Failed to clean up temp file {temp_path}: {str(e)}")
