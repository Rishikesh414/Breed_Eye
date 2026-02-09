def decision_engine(confidence: float):
    """
    Confidence-based decision logic.
    """

    if confidence >= 0.35:
        return {
            "decision": "auto",
            "reason": "Sufficient confidence – auto entry allowed"
        }

    elif confidence >= 0.20:
        return {
            "decision": "review",
            "reason": "Medium confidence – human verification suggested"
        }

    else:
        return {
            "decision": "manual",
            "reason": "Low confidence – manual entry required"
        }


