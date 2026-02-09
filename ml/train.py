import argparse
import json
import os
import random
from datetime import datetime

import numpy as np
import tensorflow as tf


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    tf.random.set_seed(seed)


def build_datasets(data_dir, img_size, batch_size, val_split, seed, test_dir=None):
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="training",
        seed=seed,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="int",
    )
    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="validation",
        seed=seed,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="int",
        shuffle=False,
    )

    test_ds = None
    if test_dir:
        test_ds = tf.keras.preprocessing.image_dataset_from_directory(
            test_dir,
            image_size=img_size,
            batch_size=batch_size,
            label_mode="int",
            shuffle=False,
        )

    class_names = train_ds.class_names
    return train_ds, val_ds, test_ds, class_names


def compute_class_weights(dataset, num_classes):
    labels = np.concatenate([y.numpy() for _, y in dataset], axis=0)
    class_counts = np.bincount(labels, minlength=num_classes)
    total = class_counts.sum()
    weights = {i: total / (num_classes * count) for i, count in enumerate(class_counts)}
    return weights


def build_model(num_classes, img_size, base_trainable=False, dropout=0.2):
    data_augmentation = tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.05),
            tf.keras.layers.RandomZoom(0.1),
            tf.keras.layers.RandomContrast(0.1),
        ],
        name="augmentation",
    )

    inputs = tf.keras.Input(shape=(*img_size, 3))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)

    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(*img_size, 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = base_trainable
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(dropout)(x)
    outputs = tf.keras.layers.Dense(num_classes)(x)

    model = tf.keras.Model(inputs, outputs)
    return model, base_model


def compile_model(model, lr):
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=lr),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=[
            tf.keras.metrics.SparseCategoricalAccuracy(name="accuracy"),
            tf.keras.metrics.SparseTopKCategoricalAccuracy(k=2, name="top_2_acc"),
        ],
    )


def main():
    parser = argparse.ArgumentParser(description="Train MobileNetV2 on cattle/buffalo breeds.")
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--test-dir")
    parser.add_argument("--img-size", type=int, default=224)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--fine-tune-epochs", type=int, default=10)
    parser.add_argument("--val-split", type=float, default=0.2)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--fine-tune-lr", type=float, default=1e-5)
    parser.add_argument("--unfreeze-layers", type=int, default=40)
    parser.add_argument("--dropout", type=float, default=0.2)
    parser.add_argument("--output-dir", default="ml/outputs")
    args = parser.parse_args()

    set_seed(args.seed)

    img_size = (args.img_size, args.img_size)
    train_ds, val_ds, test_ds, class_names = build_datasets(
        args.data_dir,
        img_size,
        args.batch_size,
        args.val_split,
        args.seed,
        args.test_dir,
    )

    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=autotune)
    val_ds = val_ds.cache().prefetch(buffer_size=autotune)
    if test_ds is not None:
        test_ds = test_ds.cache().prefetch(buffer_size=autotune)

    num_classes = len(class_names)
    class_weights = compute_class_weights(train_ds.unbatch().batch(1024), num_classes)

    model, base_model = build_model(
        num_classes=num_classes,
        img_size=img_size,
        base_trainable=False,
        dropout=args.dropout,
    )
    compile_model(model, args.lr)

    log_dir = os.path.join(args.output_dir, "logs", datetime.now().strftime("%Y%m%d-%H%M%S"))
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(args.output_dir, "best_model.keras"),
            save_best_only=True,
            monitor="val_accuracy",
            mode="max",
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
        ),
        tf.keras.callbacks.TensorBoard(log_dir=log_dir),
    ]

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    base_model.trainable = True
    for layer in base_model.layers[:-args.unfreeze_layers]:
        layer.trainable = False

    compile_model(model, args.fine_tune_lr)

    fine_tune_history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs + args.fine_tune_epochs,
        initial_epoch=history.epoch[-1] + 1,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    os.makedirs(args.output_dir, exist_ok=True)
    model.save(os.path.join(args.output_dir, "final_model.keras"))

    with open(os.path.join(args.output_dir, "class_names.json"), "w") as f:
        json.dump(class_names, f, indent=2)

    if test_ds is not None:
        test_metrics = model.evaluate(test_ds, return_dict=True)
        with open(os.path.join(args.output_dir, "test_metrics.json"), "w") as f:
            json.dump(test_metrics, f, indent=2)


if __name__ == "__main__":
    main()