# Potato Plant Disease Detection

An end-to-end full-stack deep learning project that identifies Potato Plant Diseases (Early Blight, Late Blight, or Healthy) from leaf images.

## Architecture Summary
The machine learning model uses a 5-block Convolutional Neural Network (CNN) architecture trained on the PlantVillage dataset via TensorFlow.

1. **Input Layer**: 256x256x3 (RGB)
2. **Preprocessing**: Image Resizing & Rescaling (1./255)
3. **Data Augmentation**: RandomFlip, RandomRotation(0.2), RandomZoom(0.2), RandomContrast(0.2)
4. **Hidden Layers**:
   - 5 x (Conv2D + MaxPooling2D) blocks with increasing filters (32 -> 64). Activation: ReLU.
5. **Classification Head**:
   - Flatten
   - Dense (128 units, ReLU)
   - Dropout (0.3 rate)
   - Dense (3 units, Softmax)

## Setup & Running Instructions

### 1. Training the Model (Kaggle)
1. Navigate to [Kaggle](https://www.kaggle.com/) and create a new notebook.
2. Add the [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease).
3. Ensure you have GPU acceleration turned on under `Notebook Options > Accelerator > GPU`.
4. Upload `kaggle/train_model.py` and run the script.
5. Once complete, the Kaggle output will contain `.keras` and `SavedModel` exports, as well as `class_names.json`.

### 2. Download the Model
1. Download `potato_model/` (or `potato_model.keras`) and `class_names.json` from the Kaggle outputs.
2. Place both of these inside the `backend/` directory of this repo.

### 3. Running the Backend
1. Open a terminal and navigate to the `backend/` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the FastAPI server: `uvicorn main:app --reload`
6. The API will be available at http://localhost:8000.

### 4. Running the Frontend
1. Open a new terminal and navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Start the React development server: `npm start`
4. The web app will automatically open at http://localhost:3000.

---

## Technical Stack Table

| Component   | Technology         | Purpose                              |
|-------------|--------------------|--------------------------------------|
| **Model**   | TensorFlow & Keras | Deep Learning classification         |
| **Backend** | FastAPI + Uvicorn  | High-performance async REST API      |
| **Frontend**| React.js           | Client-side interactive UI           |
| **Compute** | Kaggle GPU         | Cloud-based accelerated ML training |
| **Logic**   | Python / Node.js   | App processing and scaling           |

---

## API Reference

### Predict Endpoint
**POST /predict**

Accepts a multipart/form-data request containing an image file.

**Request:**
- `file`: (File, required) The leaf image to analyze.

**Example Response:**
```json
{
  "predicted_class": "Potato___Early_blight",
  "display_name": "Early Blight",
  "confidence": 0.985,
  "all_predictions": {
    "Potato___Early_blight": 0.985,
    "Potato___Late_blight": 0.010,
    "Potato___healthy": 0.005
  },
  "disease_info": {
    "display_name": "Early Blight",
    "severity": "Moderate",
    "cause": "Fungus (Alternaria solani)",
    "symptoms": "Brown circular spots with concentric rings on older leaves.",
    "treatment": "Use certified disease-free seeds. Apply appropriate fungicides. Practice crop rotation.",
    "color": "#fbbf24"
  }
}
```

---

## Future Work
- **React Native App**: Port the existing React web application into a React Native mobile application for on-the-field farmers.
- **TF Lite Migration**: Quantize and export the model to `.tflite` to run natively within the mobile app, reducing server latency and costs.
- **GCP Deployment**: Containerize the FastAPI backend via Docker and host on Google Cloud Platform (Cloud Run) for robust scaling.
