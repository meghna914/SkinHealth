# Hospital Finder Backend API

A simple Flask API that provides hospital data and location-based search functionality for the SkinHealth Hospital Finder feature.

## Features

- **GET /api/hospitals** - Get all hospitals
- **POST /api/hospitals/nearby** - Get hospitals sorted by distance from user location
- **GET /api/hospitals/{id}** - Get specific hospital by ID
- **GET /api/health** - Health check endpoint

## Setup Instructions

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   
   **On Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **On macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Flask application:**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### 1. Get All Hospitals
```
GET /api/hospitals
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "NewYork-Presbyterian Hospital",
      "lat": 40.7831,
      "lng": -73.9712,
      "address": "525 E 68th St, New York, NY 10065",
      "phone": "+1 (212) 746-5454",
      "rating": 4.6
    }
  ],
  "count": 10
}
```

### 2. Get Nearby Hospitals
```
POST /api/hospitals/nearby
Content-Type: application/json

{
  "lat": 40.7128,
  "lng": -74.0060
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "NewYork-Presbyterian Hospital",
      "lat": 40.7831,
      "lng": -73.9712,
      "address": "525 E 68th St, New York, NY 10065",
      "phone": "+1 (212) 746-5454",
      "rating": 4.6,
      "distance": 8.2
    }
  ],
  "count": 10,
  "user_location": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

### 3. Get Hospital by ID
```
GET /api/hospitals/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "NewYork-Presbyterian Hospital",
    "lat": 40.7831,
    "lng": -73.9712,
    "address": "525 E 68th St, New York, NY 10065",
    "phone": "+1 (212) 746-5454",
    "rating": 4.6
  }
}
```

### 4. Health Check
```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Hospital Finder API is running",
  "version": "1.0.0"
}
```

## Hospital Data

The API currently includes 10 major hospitals across the United States:

1. **NewYork-Presbyterian Hospital** - New York, NY
2. **Mount Sinai Hospital** - New York, NY
3. **NYU Langone Health** - New York, NY
4. **Cedars-Sinai Medical Center** - Los Angeles, CA
5. **UCLA Medical Center** - Los Angeles, CA
6. **Northwestern Memorial Hospital** - Chicago, IL
7. **Houston Methodist Hospital** - Houston, TX
8. **Mayo Clinic** - Rochester, MN
9. **Johns Hopkins Hospital** - Baltimore, MD
10. **Massachusetts General Hospital** - Boston, MA

## Distance Calculation

The API uses the Haversine formula to calculate the distance between the user's location and each hospital. Distances are returned in kilometers with one decimal place precision.

## CORS Configuration

The API is configured with CORS (Cross-Origin Resource Sharing) to allow requests from the frontend application running on different ports.

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Invalid or missing parameters
- **404 Not Found** - Hospital or endpoint not found
- **500 Internal Server Error** - Server-side errors

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Development

To add more hospitals, simply add them to the `hospitals` list in `app.py`:

```python
{
    "id": 11,
    "name": "Hospital Name",
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Medical St, City, State 12345",
    "phone": "+1 (555) 123-4567",
    "rating": 4.5,
}
```

## Production Deployment

For production deployment, consider:

1. **Use a production WSGI server** like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Use environment variables** for configuration
3. **Add authentication** if needed
4. **Use a proper database** instead of in-memory data
5. **Add logging** and monitoring
6. **Configure proper CORS** settings for your domain

## Testing

You can test the API using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all hospitals
curl http://localhost:5000/api/hospitals

# Get nearby hospitals
curl -X POST http://localhost:5000/api/hospitals/nearby \
  -H "Content-Type: application/json" \
  -d '{"lat": 40.7128, "lng": -74.0060}'
```
