import tensorflow as tf
from tensorflow.keras import models, layers
import matplotlib.pyplot as plt
import numpy as np
import os
import json

# ==========================================
# 1. Hyperparameters & Configuration
# ==========================================
BATCH_SIZE = 32
IMAGE_SIZE = 256
EPOCHS = 50
CHANNELS = 3

# Kaggle dataset path (Adjust the actual dataset folder name depending on the exact dataset you attached in Kaggle)
# Adjusted to local path since PlantVillage was placed in the backend directory
DATASET_PATH = "../backend/PlantVillage"

potato_classes = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']

# ==========================================
# 2. Load Dataset & Filter
# ==========================================
print("Loading dataset...")

# We load the entire directory using image_dataset_from_directory, 
# filtering only for our 3 potato classes by specifying 'class_names'
dataset = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_PATH,
    seed=123,
    shuffle=True,
    image_size=(IMAGE_SIZE, IMAGE_SIZE),
    batch_size=BATCH_SIZE,
    class_names=potato_classes
)

class_names = dataset.class_names
print("Classes loaded:", class_names)

# Save class names for the backend
with open('class_names.json', 'w') as f:
    json.dump(class_names, f)

# ==========================================
# 3. Train/Val/Test Split (80/10/10)
# ==========================================
def get_dataset_partitions_tf(ds, train_split=0.8, val_split=0.1, test_split=0.1, shuffle=True, shuffle_size=10000):
    assert (train_split + test_split + val_split) == 1
    
    ds_size = len(ds)
    if shuffle:
        ds = ds.shuffle(shuffle_size, seed=12)
    
    train_size = int(train_split * ds_size)
    val_size = int(val_split * ds_size)
    
    train_ds = ds.take(train_size)    
    val_ds = ds.skip(train_size).take(val_size)
    test_ds = ds.skip(train_size).skip(val_size)
    
    return train_ds, val_ds, test_ds

train_ds, val_ds, test_ds = get_dataset_partitions_tf(dataset)

print(f"Train sizes: {len(train_ds)} batches")
print(f"Validation sizes: {len(val_ds)} batches")
print(f"Test sizes: {len(test_ds)} batches")

# Caching & prefetching for performance optimization
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
test_ds = test_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

# ==========================================
# 4. Data Augmentation Layer
# ==========================================
resize_and_rescale = tf.keras.Sequential([
  layers.Resizing(IMAGE_SIZE, IMAGE_SIZE),
  layers.Rescaling(1./255),
])

data_augmentation = tf.keras.Sequential([
  layers.RandomFlip("horizontal_and_vertical"),
  layers.RandomRotation(0.2),
  layers.RandomZoom(0.2),
  layers.RandomContrast(0.2)
])

# ==========================================
# 5. Build CNN Architecture
# ==========================================
input_shape = (BATCH_SIZE, IMAGE_SIZE, IMAGE_SIZE, CHANNELS)
n_classes = len(class_names)

model = models.Sequential([
    resize_and_rescale,
    data_augmentation,
    
    # Block 1
    layers.Conv2D(32, kernel_size=(3,3), activation='relu', input_shape=input_shape),
    layers.MaxPooling2D((2, 2)),
    
    # Block 2
    layers.Conv2D(64, kernel_size=(3,3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Block 3
    layers.Conv2D(64, kernel_size=(3,3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Block 4
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Block 5
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Classification Head
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(n_classes, activation='softmax'),
])

model.build(input_shape=input_shape)
model.summary()

# ==========================================
# 6. Callbacks & Compilation
# ==========================================
model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
    metrics=['accuracy']
)

# Callbacks
early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss', 
    patience=5, 
    restore_best_weights=True
)

reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss', 
    factor=0.5, 
    patience=3, 
    min_lr=1e-6
)

checkpoint_filepath = 'best_model.keras'
model_checkpoint = tf.keras.callbacks.ModelCheckpoint(
    filepath=checkpoint_filepath,
    save_best_only=True,
    monitor='val_accuracy',
    mode='max'
)

# ==========================================
# 7. Training the Model
# ==========================================
print("Starting training...")
history = model.fit(
    train_ds,
    batch_size=BATCH_SIZE,
    validation_data=val_ds,
    verbose=1,
    epochs=EPOCHS,
    callbacks=[early_stopping, reduce_lr, model_checkpoint]
)

# ==========================================
# 8. Evaluation & Plotting
# ==========================================
scores = model.evaluate(test_ds)
print(f"Test Accuracy: {round(scores[1],4)*100}%")

# Plotting Accuracy and Loss
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

plt.figure(figsize=(12, 6))

plt.subplot(1, 2, 1)
plt.plot(range(len(acc)), acc, label='Training Accuracy')
plt.plot(range(len(val_acc)), val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(range(len(loss)), loss, label='Training Loss')
plt.plot(range(len(val_loss)), val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.savefig('training_metrics.png')
print("Saved training curve to training_metrics.png")

# ==========================================
# 9. Save final models
# ==========================================
# SavedModel format
model.save('potato_model')
# .keras format
model.save('potato_model.keras')
print("Model saved in standard SavedModel and .keras formats.")

# ==========================================
# 10. Sample Prediction Verification
# ==========================================
def predict_sample(model, img):
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    
    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)
    return predicted_class, confidence

# Fetch 1 batch from the test set for a sample
for images, labels in test_ds.take(1):
    first_image = images[0].numpy().astype('uint8')
    actual_label = class_names[labels[0]]
    
    pred_class, conf = predict_sample(model, first_image)
    
    print("\n--- Sample Prediction Verification ---")
    print(f"Actual Label: {actual_label}")
    print(f"Predicted: {pred_class} (Confidence: {conf}%)")
    plt.imshow(first_image)
    plt.title(f"Actual: {actual_label}\nPred: {pred_class} ({conf}%)")
    plt.axis("off")
    plt.savefig('sample_prediction.png')
    print("Saved sample prediction output to sample_prediction.png")
    break
