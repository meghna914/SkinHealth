#!/usr/bin/env python3
"""
Test script to debug ML model integration
"""

import requests
import io
from PIL import Image
import sys

def test_ml_model_direct(ngrok_url, image_path=None):
    """Test the ML model directly without going through our backend"""
    
    if not image_path:
        # Create a simple test image
        print("Creating test image...")
        img = Image.new('RGB', (224, 224), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        filename = 'test_image.jpg'
    else:
        # Use provided image
        print(f"Using image: {image_path}")
        with open(image_path, 'rb') as f:
            img_bytes = io.BytesIO(f.read())
        filename = image_path
    
    predict_url = f"{ngrok_url.rstrip('/')}/predict"
    print(f"Testing ML model at: {predict_url}")
    
    # Try different parameter names
    param_names = ['file', 'image', 'img', 'upload', 'data']
    
    for param_name in param_names:
        print(f"\n--- Testing with parameter: '{param_name}' ---")
        
        try:
            img_bytes.seek(0)
            files = {param_name: (filename, img_bytes, 'image/jpeg')}
            
            response = requests.post(predict_url, files=files, timeout=30)
            
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                try:
                    result = response.json()
                    print(f"SUCCESS! Response: {result}")
                    return param_name, result
                except:
                    print(f"Response (not JSON): {response.text}")
            else:
                print(f"Error Response: {response.text}")
                
        except Exception as e:
            print(f"Exception: {e}")
    
    return None, None

def test_backend_api(backend_url, image_path=None):
    """Test our backend API"""
    
    if not image_path:
        # Create a simple test image
        print("Creating test image for backend...")
        img = Image.new('RGB', (224, 224), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        filename = 'test_image.jpg'
    else:
        # Use provided image
        print(f"Using image for backend: {image_path}")
        with open(image_path, 'rb') as f:
            img_bytes = io.BytesIO(f.read())
        filename = image_path
    
    predict_url = f"{backend_url.rstrip('/')}/api/predict"
    print(f"\nTesting backend at: {predict_url}")
    
    try:
        img_bytes.seek(0)
        files = {'file': (filename, img_bytes, 'image/jpeg')}
        
        response = requests.post(predict_url, files=files, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print(f"Backend SUCCESS! Response: {result}")
                return result
            except:
                print(f"Backend Response (not JSON): {response.text}")
        else:
            print(f"Backend Error Response: {response.text}")
            
    except Exception as e:
        print(f"Backend Exception: {e}")
    
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_ml_model.py <ngrok_url> [image_path]")
        print("Example: python test_ml_model.py https://1dd0-34-75-179-161.ngrok-free.app")
        sys.exit(1)
    
    ngrok_url = sys.argv[1]
    image_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    print("=" * 60)
    print("ML Model Integration Test")
    print("=" * 60)
    
    # Test ML model directly
    print("\n1. Testing ML model directly...")
    working_param, ml_result = test_ml_model_direct(ngrok_url, image_path)
    
    if working_param:
        print(f"\n✅ ML model works with parameter: '{working_param}'")
        print(f"Response format: {type(ml_result)}")
        if isinstance(ml_result, dict):
            print(f"Response keys: {list(ml_result.keys())}")
    else:
        print("\n❌ ML model test failed with all parameter names")
    
    # Test backend API
    print("\n2. Testing backend API...")
    backend_result = test_backend_api("http://localhost:5000", image_path)
    
    if backend_result:
        print("\n✅ Backend API works!")
    else:
        print("\n❌ Backend API test failed")
    
    print("\n" + "=" * 60)
    print("Test completed!")
