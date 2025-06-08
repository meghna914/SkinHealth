#!/usr/bin/env python3
"""
Simple script to configure ngrok URL in the backend
"""

import requests
import json
import sys

def configure_ngrok_url(backend_url, ngrok_url):
    """Configure the ngrok URL in the backend"""
    
    config_url = f"{backend_url.rstrip('/')}/api/ml-model/config"
    
    data = {
        "ngrok_url": ngrok_url
    }
    
    try:
        print(f"Configuring ngrok URL: {ngrok_url}")
        print(f"Backend config endpoint: {config_url}")
        
        response = requests.post(
            config_url,
            headers={'Content-Type': 'application/json'},
            json=data,
            timeout=10
        )
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Configuration successful!")
            print(f"Response: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ Configuration failed!")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error configuring ngrok URL: {e}")
        return False

def check_config(backend_url):
    """Check current configuration"""
    
    config_url = f"{backend_url.rstrip('/')}/api/ml-model/config"
    
    try:
        response = requests.get(config_url, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"Current configuration:")
            print(f"  Configured: {result.get('configured', False)}")
            print(f"  Ngrok URL: {result.get('ngrok_url', 'Not set')}")
            print(f"  Message: {result.get('message', 'N/A')}")
            return result
        else:
            print(f"Failed to check configuration: {response.text}")
            return None
            
    except Exception as e:
        print(f"Error checking configuration: {e}")
        return None

if __name__ == "__main__":
    backend_url = "http://localhost:5000"
    
    if len(sys.argv) < 2:
        print("Usage: python configure_ngrok.py <ngrok_url>")
        print("Example: python configure_ngrok.py https://1dd0-34-75-179-161.ngrok-free.app")
        print("\nChecking current configuration...")
        check_config(backend_url)
        sys.exit(1)
    
    ngrok_url = sys.argv[1]
    
    print("=" * 60)
    print("Ngrok URL Configuration")
    print("=" * 60)
    
    # Check current config
    print("\n1. Current configuration:")
    check_config(backend_url)
    
    # Configure new URL
    print(f"\n2. Setting new ngrok URL...")
    success = configure_ngrok_url(backend_url, ngrok_url)
    
    if success:
        print(f"\n3. Verifying configuration...")
        check_config(backend_url)
        print(f"\n✅ Configuration complete! You can now test image uploads.")
    else:
        print(f"\n❌ Configuration failed!")
    
    print("=" * 60)
