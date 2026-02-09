import numpy as np
from .models import (
    species_interpreter,
    buffalo_interpreter,
    cattle_interpreter,
    SPECIES_LABELS,
    BUFFALO_LABELS,
    CATTLE_LABELS,
)
from ..utils.image_utils import preprocess_image
from .confidence import decision_engine


def run_tflite(interpreter, image):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Optimize: Use invoke() directly without unnecessary checks
    interpreter.set_tensor(input_details[0]["index"], image)
    interpreter.invoke()

    return interpreter.get_tensor(output_details[0]["index"])[0]


def predict(image_path: str):
    image = preprocess_image(image_path)

    # 1️⃣ Species
    species_probs = run_tflite(species_interpreter, image)

    # Validate species model output
    if len(species_probs) != len(SPECIES_LABELS):
        raise ValueError(f"Species model output size {len(species_probs)} does not match labels {len(SPECIES_LABELS)}")

    species_idx = int(np.argmax(species_probs))
    if species_idx >= len(SPECIES_LABELS):
        raise ValueError(f"Invalid species index {species_idx}, max allowed {len(SPECIES_LABELS)-1}")

    species = SPECIES_LABELS[species_idx]
    species_conf = float(species_probs[species_idx])

    # 2️⃣ Breed
    if species == "buffalo":
        probs = run_tflite(buffalo_interpreter, image)
        labels = BUFFALO_LABELS
    else:
        probs = run_tflite(cattle_interpreter, image)
        labels = CATTLE_LABELS

    # Validate breed model output
    if len(probs) != len(labels):
        raise ValueError(f"Breed model output size {len(probs)} does not match labels {len(labels)} for species {species}")

    # Get top predictions, but limit to available classes
    num_predictions = min(3, len(probs))
    top_indices = np.argsort(probs)[-num_predictions:][::-1]

    top_predictions = [
        {
            "breed": labels[i],
            "confidence": float(probs[i])
        }
        for i in top_indices if i < len(labels)
    ]

    if not top_predictions:
        raise ValueError(f"No valid predictions could be made for species {species}")

    best_confidence = top_predictions[0]["confidence"]
    decision = decision_engine(best_confidence)

    return {
        "species": species,
        "species_confidence": species_conf,
        "best_breed": top_predictions[0]["breed"],
        "best_confidence": best_confidence,
        "top_predictions": top_predictions,
        **decision
    }
