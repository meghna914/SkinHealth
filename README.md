# SkinHealth Diagnosis Platform

A modern web application for skin health diagnosis and healthcare facility location services.

## Hospital Finder Feature

The Hospital Finder feature allows users to find the nearest hospitals based on their current location. The feature includes:

- **Location Detection**: Uses browser geolocation to get user's current position
- **Distance Calculation**: Calculates and displays distance to each hospital
- **Sorted Results**: Shows hospitals in order of increasing distance
- **Contact Information**: Provides phone numbers and addresses
- **Direct Actions**: Get directions via Google Maps or call hospitals directly
- **Rating System**: Displays hospital ratings with star ratings

### Quick Start

1. **Start the development environment:**

   **Windows:**
   ```bash
   start-dev.bat
   ```

   **macOS/Linux:**
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

2. **Or start manually:**

   **Backend (Flask API):**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

   **Frontend (React):**
   ```bash
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Usage

1. Navigate to Dashboard → Hospital Finder
2. Click "Find Nearest Hospitals" button
3. Allow location access when prompted
4. View hospitals sorted by distance
5. Use "Directions" or "Call" buttons for each hospital

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Flask** Python web framework
- **Flask-CORS** for cross-origin requests
- **RESTful API** design

## Project Structure

```
SkinHealth/
├── src/                          # React frontend source
│   ├── components/
│   │   └── dashboard/
│   │       └── HospitalFinder.tsx # Main hospital finder component
│   ├── pages/                    # Page components
│   ├── contexts/                 # React contexts
│   └── hooks/                    # Custom React hooks
├── backend/                      # Flask backend
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # Backend documentation
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## Features

### Current Features
- User authentication and dashboard
- Hospital finder with location-based search
- Distance calculation and sorting
- Contact information and direct actions
- Responsive design for mobile and desktop

### Hospital Database
The application includes data for 10 major hospitals across the United States:
- NewYork-Presbyterian Hospital (New York, NY)
- Mount Sinai Hospital (New York, NY)
- NYU Langone Health (New York, NY)
- Cedars-Sinai Medical Center (Los Angeles, CA)
- UCLA Medical Center (Los Angeles, CA)
- Northwestern Memorial Hospital (Chicago, IL)
- Houston Methodist Hospital (Houston, TX)
- Mayo Clinic (Rochester, MN)
- Johns Hopkins Hospital (Baltimore, MD)
- Massachusetts General Hospital (Boston, MA)

## Development

### Prerequisites
- Node.js 16+ and npm
- Python 3.7+
- Modern web browser with geolocation support

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SkinHealth
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Start development servers:**
   ```bash
   # Use the provided scripts
   ./start-dev.sh  # or start-dev.bat on Windows

   # Or start manually in separate terminals
   npm run dev                    # Frontend
   cd backend && python app.py    # Backend
   ```

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals/nearby` - Get hospitals sorted by distance
- `GET /api/hospitals/{id}` - Get specific hospital

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**Note:** Geolocation requires HTTPS in production environments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.