#!/usr/bin/env python3
"""
Test script to verify Google Gemini AI integration
"""

import google.generativeai as genai
import os
import sys

# API Key
GOOGLE_AI_API_KEY = 'AIzaSyAdaxYtbQnls5-BNp8qds8or2mgEW79Y00'

def list_available_models():
    """List all available models"""
    print("📋 Listing Available Models")
    print("=" * 50)

    try:
        genai.configure(api_key=GOOGLE_AI_API_KEY)

        print("Fetching available models...")
        models = genai.list_models()

        print("\n🤖 Available Models:")
        for model in models:
            print(f"  • {model.name}")
            if hasattr(model, 'display_name'):
                print(f"    Display Name: {model.display_name}")
            if hasattr(model, 'supported_generation_methods'):
                methods = list(model.supported_generation_methods)
                print(f"    Supported Methods: {methods}")
            print()

        return True

    except Exception as e:
        print(f"❌ Error listing models: {e}")
        return False

def test_gemini_api():
    """Test the Google Gemini API directly"""

    print("🧪 Testing Google Gemini AI Integration")
    print("=" * 50)

    try:
        # Configure the API
        print("1. Configuring API key...")
        genai.configure(api_key=GOOGLE_AI_API_KEY)
        print("✅ API key configured")
        
        # Initialize the model
        print("\n2. Initializing Gemini model...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Model initialized")
        
        # Test with a simple prompt
        print("\n3. Testing with simple prompt...")
        test_prompt = "What is eczema? Please provide a brief medical explanation."
        
        print(f"Prompt: {test_prompt}")
        print("Sending request to Gemini...")
        
        response = model.generate_content(test_prompt)
        
        print(f"Response object: {type(response)}")
        print(f"Response attributes: {dir(response)}")
        
        if hasattr(response, 'text') and response.text:
            print("✅ Response received successfully!")
            print(f"Response length: {len(response.text)} characters")
            print("\n📝 Response content:")
            print("-" * 30)
            print(response.text)
            print("-" * 30)
            return True
        else:
            print("❌ No text in response")
            print(f"Response: {response}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_medical_prompt():
    """Test with a medical-focused prompt similar to the chatbot"""
    
    print("\n\n🏥 Testing Medical Assistant Prompt")
    print("=" * 50)
    
    try:
        genai.configure(api_key=GOOGLE_AI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Medical prompt similar to the chatbot
        system_prompt = """You are a helpful medical assistant for a skin health application. You provide information about:
        - Skin conditions (eczema, psoriasis, acne, rashes, etc.)
        - General healthcare advice
        - When to see a doctor or dermatologist
        - Skin care tips and treatments
        
        Important guidelines:
        - Always emphasize that you're providing general information, not medical diagnosis
        - Recommend consulting healthcare professionals for serious concerns
        - Be empathetic and supportive
        - Keep responses concise but informative
        - If asked about non-medical topics, politely redirect to health-related questions
        - For emergencies, always recommend immediate medical attention
        
        Current user question: """
        
        user_question = "tell me about blood sugar levels"
        full_prompt = system_prompt + user_question
        
        print(f"User question: {user_question}")
        print("Generating response...")
        
        response = model.generate_content(full_prompt)
        
        if hasattr(response, 'text') and response.text:
            print("✅ Medical response generated successfully!")
            print(f"Response length: {len(response.text)} characters")
            print("\n📝 Medical Response:")
            print("-" * 30)
            print(response.text)
            print("-" * 30)
            return True
        else:
            print("❌ No text in medical response")
            print(f"Response: {response}")
            return False
            
    except Exception as e:
        print(f"❌ Medical prompt error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""

    print("🚀 Starting Gemini AI Integration Tests\n")

    # Test 0: List available models
    print("Step 0: Checking available models...")
    list_available_models()

    # Test 1: Basic API functionality
    basic_test = test_gemini_api()

    # Test 2: Medical assistant prompt
    medical_test = test_medical_prompt()
    
    # Summary
    print("\n\n📊 Test Summary")
    print("=" * 50)
    print(f"Basic API Test: {'✅ PASS' if basic_test else '❌ FAIL'}")
    print(f"Medical Prompt Test: {'✅ PASS' if medical_test else '❌ FAIL'}")
    
    if basic_test and medical_test:
        print("\n🎉 All tests passed! Gemini AI integration is working correctly.")
        print("The chatbot should be able to generate responses.")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
        print("Possible issues:")
        print("- API key might be invalid or expired")
        print("- Network connectivity issues")
        print("- Google AI API service might be down")
        print("- API quotas might be exceeded")
    
    return basic_test and medical_test

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
