import argparse
import json
import os

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix


def load_dataset(data_dir, img_size, batch_size):
    ds = tf.keras.preprocessing.image_dataset_from_directory(
        data_dir,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="int",
        shuffle=False,
    )
    return ds, ds.class_names


def main():
    parser = argparse.ArgumentParser(description="Evaluate model with confusion matrix and report.")
    parser.add_argument("--model", required=True)
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--img-size", type=int, default=224)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--output-dir", default="ml/outputs")
    args = parser.parse_args()

    img_size = (args.img_size, args.img_size)
    dataset, class_names = load_dataset(args.data_dir, img_size, args.batch_size)

    model = tf.keras.models.load_model(args.model)

    logits = model.predict(dataset)
    y_pred = np.argmax(logits, axis=1)
    y_true = np.concatenate([y for _, y in dataset], axis=0)

    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    cm = confusion_matrix(y_true, y_pred)

    os.makedirs(args.output_dir, exist_ok=True)
    with open(os.path.join(args.output_dir, "classification_report.json"), "w") as f:
        json.dump(report, f, indent=2)

    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(cm, cmap="Blues")
    ax.set_xticks(range(len(class_names)))
    ax.set_yticks(range(len(class_names)))
    ax.set_xticklabels(class_names, rotation=45, ha="right")
    ax.set_yticklabels(class_names)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    ax.set_title("Confusion Matrix")
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, cm[i, j], ha="center", va="center", color="black")
    fig.colorbar(im)
    fig.tight_layout()
    fig.savefig(os.path.join(args.output_dir, "confusion_matrix.png"))


if __name__ == "__main__":
    main()