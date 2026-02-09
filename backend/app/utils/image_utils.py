import cv2
import numpy as np
import logging

logger = logging.getLogger(__name__)
IMG_SIZE = 224

def preprocess_image(image_path: str) -> np.ndarray:
    try:
        img = cv2.imread(image_path)

        if img is None:
            raise ValueError("Invalid or unreadable image")

        # Validate image dimensions
        if img.shape[0] == 0 or img.shape[1] == 0:
            raise ValueError("Image has invalid dimensions")

        # Optimize: Use INTER_LINEAR for faster resizing
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE), interpolation=cv2.INTER_LINEAR)
        img = img.astype("float32") / 255.0

        return np.expand_dims(img, axis=0)

    except Exception as e:
        logger.error(f"Error preprocessing image {image_path}: {str(e)}")
        raise ValueError(f"Failed to preprocess image: {str(e)}")
