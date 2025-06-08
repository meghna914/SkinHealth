# SkinHealth Medical Chatbot Setup Guide

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Start the Application

```bash
# Option 1: Use the startup script (recommended)
node start.js

# Option 2: Manual startup
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
npm run dev
```

## 🧪 Testing the Chatbot Integration

### Method 1: Test Page (Recommended)
1. Open: `http://localhost:5173/../test-chatbot-integration.html`
2. Run all tests in sequence:
   - Backend Health Check
   - API Configuration Check
   - Google AI Integration Test
   - Chatbot Message Test

### Method 2: Direct API Testing
```bash
# Test Google AI directly
cd backend
python test_gemini.py

# Test chatbot endpoint
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is eczema?"}'
```

### Method 3: Web Interface
1. Go to: `http://localhost:5173`
2. Navigate to Dashboard → Medical Chatbot
3. Ask questions like:
   - "What is eczema?"
   - "How do I treat acne?"
   - "When should I see a dermatologist?"

## 🔍 Troubleshooting

### Issue: Chatbot returns "technical difficulties" message

**Possible Causes:**
1. Google AI API key issues
2. Network connectivity problems
3. Missing dependencies
4. API quota exceeded

**Solutions:**

1. **Check API Key:**
   ```bash
   cd backend
   python test_gemini.py
   ```

2. **Verify Dependencies:**
   ```bash
   cd backend
   pip install google-generativeai==0.3.2
   ```

3. **Check Backend Logs:**
   - Look for error messages in the terminal running `python app.py`
   - Check for authentication errors or API limit messages

4. **Test API Endpoint:**
   ```bash
   curl http://localhost:5000/api/chatbot/test
   ```

### Issue: "Module not found" errors

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend

**Solutions:**
1. Ensure backend is running on port 5000
2. Check CORS configuration
3. Verify API endpoints are accessible:
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📝 API Endpoints

- **Health Check:** `GET /api/health`
- **Configuration:** `GET /api/config`
- **AI Test:** `GET /api/chatbot/test`
- **Send Message:** `POST /api/chatbot/message`

## 🔑 API Keys Used

- **Hospital Finder:** `AIzaSyDVEJAuVXSA78o8-p5MzS_F7FW56C7_BdI`
- **Medical Chatbot:** `AIzaSyAdaxYtbQnls5-BNp8qds8or2mgEW79Y00`

## ✅ Success Indicators

When everything is working correctly:
1. Backend starts without errors
2. Frontend loads at `http://localhost:5173`
3. Test page shows all green checkmarks
4. Chatbot responds with relevant medical information
5. No "technical difficulties" messages

## 🎯 Features

- **Real AI Responses:** Powered by Google Gemini AI
- **Medical Focus:** Specialized for skin health and medical questions
- **Conversation History:** Maintains context for better responses
- **Error Handling:** Graceful fallbacks for API issues
- **Professional Disclaimers:** Emphasizes AI is not medical diagnosis

## 📞 Support

If you continue to have issues:
1. Check the backend terminal for detailed error messages
2. Run the test script: `python backend/test_gemini.py`
3. Verify all dependencies are installed correctly
4. Ensure network connectivity to Google's APIs
