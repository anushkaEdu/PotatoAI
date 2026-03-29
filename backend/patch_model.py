import zipfile
import json
import os
import shutil

model_path = os.path.join(os.path.dirname(__file__), "kaggle", "model", "potato_model.keras")
backup_path = model_path + ".bak"

def patch_keras_file(path):
    print(f"Applying Advanced Deserialization Patch to: {path}")
    
    # 1. Restore from pristine backup to avoid compounding patches
    if os.path.exists(backup_path):
        print("Restoring pristine Kaggle model from backup...")
        shutil.copyfile(backup_path, path)
    else:
        # Create initial backup if it doesn't exist just in case
        shutil.copyfile(path, backup_path)
    
    temp_dir = "temp_keras_patch_v2"
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir, exist_ok=True)
    
    with zipfile.ZipFile(path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
    
    config_path = os.path.join(temp_dir, "config.json")
    with open(config_path, 'r') as f:
        config_data = json.load(f)
    
    # 2. Strip augmentation layers (not needed for inference and cause schema issues)
    if "config" in config_data and "layers" in config_data["config"]:
        original_count = len(config_data["config"]["layers"])
        filtered_layers = []
        for layer in config_data["config"]["layers"]:
            if layer.get("class_name") not in ["RandomFlip", "RandomRotation", "RandomZoom", "RandomBrightness", "RandomContrast", "RandomCrop"]:
                filtered_layers.append(layer)
        config_data["config"]["layers"] = filtered_layers
        print(f"Stripped {original_count - len(filtered_layers)} augmentation nodes from graph (inference optimization).")

    # 3. Recursive generic patching
    def patch_dict(d):
        if isinstance(d, dict):
            
            # Convert Keras 3 DTypePolicy dict syntax strictly back into native Keras 2 strings
            if "dtype" in d and isinstance(d["dtype"], dict):
                if d["dtype"].get("class_name") == "DTypePolicy":
                    name = d["dtype"].get("config", {}).get("name", "float32")
                    d["dtype"] = name
                    print("Patched localized Keras 3 DTypePolicy mapping -> Keras 2 string.")
            
            # Convert generic class_name InputLayer batch_shape -> batch_input_shape mappings
            if d.get("class_name") == "InputLayer":
                if "config" in d and "batch_shape" in d["config"]:
                    d["config"]["batch_input_shape"] = d["config"].pop("batch_shape")
                    print("Patched InputLayer batch structure mapping.")
            
            for k, v in d.items():
                patch_dict(v)
        elif isinstance(d, list):
            for v in d:
                patch_dict(v)

    patch_dict(config_data)

    with open(config_path, 'w') as f:
        json.dump(config_data, f)
    
    with zipfile.ZipFile(path, 'w') as zip_ref:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_dir)
                zip_ref.write(file_path, arcname)
    
    shutil.rmtree(temp_dir)
    print("Advanced V2 Patch Applied Successfully!")

if __name__ == "__main__":
    patch_keras_file(model_path)
