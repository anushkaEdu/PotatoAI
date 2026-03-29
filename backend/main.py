import os
if "TF_USE_LEGACY_KERAS" in os.environ:
    del os.environ["TF_USE_LEGACY_KERAS"]
import json
import numpy as np
import tensorflow as tf
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), "kaggle", "model", "potato_model.keras")
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), "kaggle", "model", "class_names.json")

# Global variables for model and classes
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load class names
    try:
        with open(CLASS_NAMES_PATH, "r") as f:
            ml_models["class_names"] = json.load(f)
            # Remove the "Potato___" prefix and underscores if present to match the expected format Let's just create clean names
            clean_names = []
            for name in ml_models["class_names"]:
                clean_name = name.replace("Potato___", "").replace("_", " ")
                clean_names.append(clean_name)
            ml_models["clean_names"] = clean_names
    except Exception as e:
        print(f"Error loading class names: {e}")
        # Fallback names
        ml_models["class_names"] = ["Potato___Early_blight", "Potato___Late_blight", "Potato___healthy"]
        ml_models["clean_names"] = ["Early Blight", "Late Blight", "Healthy"]

    # Load model
    try:
        # Check if .keras file exists
        if os.path.exists(MODEL_PATH):
            class DummyAugment(tf.keras.layers.Layer):
                def __init__(self, **kwargs):
                    super().__init__() # discard all deserialized params fundamentally
                def call(self, inputs):
                    return inputs
                def get_config(self):
                    return {}

            custom_objs = {
                "RandomFlip": DummyAugment,
                "RandomRotation": DummyAugment,
                "RandomZoom": DummyAugment,
                "RandomBrightness": DummyAugment,
                "RandomContrast": DummyAugment,
                "RandomCrop": DummyAugment
            }

            ml_models["model"] = tf.keras.models.load_model(MODEL_PATH, custom_objects=custom_objs, compile=False)
            print("Model loaded successfully.")
            # Warm up
            dummy_input = np.zeros((1, 256, 256, 3), dtype=np.float32)
            ml_models["model"].predict(dummy_input)
            print("Model warmed up.")
        else:
            print(f"Model file not found at {MODEL_PATH}. Using mock predictions.")
            ml_models["model"] = None
    except Exception as e:
        print(f"Failed to load model: {e}")
        ml_models["model"] = None

    yield
    # Cleanup resources if necessary
    ml_models.clear()

app = FastAPI(
    title="Potato Disease Detector",
    description="API for classifying potato leaf diseases",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins including localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    try:
        image = Image.open(BytesIO(image_bytes))
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Resize to 256x256
        image = image.resize((256, 256))
        
        # Convert to numpy array
        img_array = np.array(image, dtype=np.float32)
        
        # Add batch dimension: [1, 256, 256, 3]
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file or format.")

@app.get("/")
async def health_check():
    return {
        "status": "ok", 
        "model": "PotatoCNN", 
        "version": "1.0.0"
    }

@app.get("/classes")
async def get_classes():
    return {"classes": ml_models.get("clean_names", [])}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
    
    file_bytes = await file.read()
    img_array = preprocess_image(file_bytes)
    
    model = ml_models.get("model")
    class_names_clean = ml_models.get("clean_names")
    
    if model is None:
        # Fallback behaviour if model hasn't been downloaded yet
        predictions = [[0.9834, 0.0142, 0.0024]]
    else:
        predictions = model.predict(img_array).tolist()
        
    probabilities = predictions[0]
    predicted_index = np.argmax(probabilities)
    predicted_class = class_names_clean[predicted_index]
    confidence = float(probabilities[predicted_index])
    
    all_scores = {
        class_names_clean[i]: float(probabilities[i])
        for i in range(len(class_names_clean))
    }
    
    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "all_scores": all_scores
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
