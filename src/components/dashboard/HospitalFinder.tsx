import { useState, useEffect } from 'react';
import { MapPin, Star, Navigation, Clock, Search } from 'lucide-react';
import { buildApiUrl, API_CONFIG } from '../../config/api';

// Enhanced hospital type with Google Places data and accurate distances
type Hospital = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance?: number;
  distance_text?: string;
  duration_text?: string;
  directions_url?: string;
  rating?: number;
  user_ratings_total?: number;
  place_id?: string;
  types?: string[];
};





const HospitalFinder = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Fetch nearby hospitals from API
  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS_NEARBY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat,
          lng,
          radius: 25000  // 25km search radius
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setNearbyHospitals(result.data);
        if (result.data.length === 0) {
          setError('No hospitals found within 25km of your location. Try a different area.');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch hospitals');
      }
    } catch (err: any) {
      console.error('Error fetching hospitals:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the hospital finder service. Please make sure the backend is running.');
      } else {
        setError(`Failed to load nearby hospitals: ${err.message}`);
      }
    }
  };

  // Get user's current location with enhanced error handling and fallbacks
  const getUserLocation = async () => {
    setLoading(true);
    setError(null);
    setNearbyHospitals([]);

    // Check if we're on HTTPS (required for geolocation in production)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!isSecure && window.location.hostname !== 'localhost') {
      setError('Location access requires HTTPS. Please use a secure connection.');
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Trying IP-based location...');
      await tryIPBasedLocation();
      return;
    }

    // Enhanced geolocation options
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // 5 minutes cache
    };

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          console.log(`Location found: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);

          // Validate coordinates
          if (isValidCoordinates(latitude, longitude)) {
            const userCoords: [number, number] = [latitude, longitude];
            setUserLocation(userCoords);

            // Fetch hospitals from API
            await fetchNearbyHospitals(latitude, longitude);
            setLoading(false);
          } else {
            throw new Error('Invalid coordinates received');
          }
        },
        async (err) => {
          console.error('Geolocation error:', err);

          let errorMessage = 'Unable to access your location. ';

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage += 'Please allow location access and try again.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable. Trying IP-based location...';
              await tryIPBasedLocation();
              return;
            case err.TIMEOUT:
              errorMessage += 'Location request timed out. Trying IP-based location...';
              await tryIPBasedLocation();
              return;
            default:
              errorMessage += 'An unknown error occurred. Trying IP-based location...';
              await tryIPBasedLocation();
              return;
          }

          setError(errorMessage);
          setLoading(false);
        },
        options
      );
    } catch (error) {
      console.error('Geolocation setup error:', error);
      await tryIPBasedLocation();
    }
  };

  // Validate coordinates
  const isValidCoordinates = (lat: number, lng: number): boolean => {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  };

  // IP-based location fallback
  const tryIPBasedLocation = async () => {
    try {
      console.log('Attempting IP-based geolocation...');

      // Try multiple IP geolocation services
      const services = [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://api.ipify.org?format=json' // This one only gives IP, we'd need another call
      ];

      for (const serviceUrl of services) {
        try {
          const response = await fetch(serviceUrl);
          if (!response.ok) continue;

          const data = await response.json();

          let latitude, longitude;

          // Handle different API response formats
          if (data.latitude && data.longitude) {
            // ipapi.co format
            latitude = parseFloat(data.latitude);
            longitude = parseFloat(data.longitude);
          } else if (data.loc) {
            // ipinfo.io format
            const [lat, lng] = data.loc.split(',');
            latitude = parseFloat(lat);
            longitude = parseFloat(lng);
          } else {
            continue; // Try next service
          }

          if (isValidCoordinates(latitude, longitude)) {
            console.log(`IP-based location found: ${latitude}, ${longitude} (${data.city || 'Unknown city'})`);

            const userCoords: [number, number] = [latitude, longitude];
            setUserLocation(userCoords);

            // Show info that this is IP-based (less accurate)
            setError(`Using approximate location based on your IP address (${data.city || 'Unknown city'}). For better accuracy, please allow GPS access.`);

            // Fetch hospitals from API
            await fetchNearbyHospitals(latitude, longitude);
            setLoading(false);
            return;
          }
        } catch (serviceError) {
          console.error(`Error with ${serviceUrl}:`, serviceError);
          continue;
        }
      }

      // If all services fail, use a default location (you can customize this)
      setError('Unable to determine your location. Please allow location access or check your internet connection.');
      setLoading(false);

    } catch (error) {
      console.error('IP-based geolocation failed:', error);
      setError('Unable to determine your location. Please allow location access or check your internet connection.');
      setLoading(false);
    }
  };

  // Manual location search using geocoding
  const searchManualLocation = async () => {
    if (!manualLocation.trim()) {
      setError('Please enter a location (e.g., "New York, NY" or "Bangalore, India")');
      return;
    }

    setLoading(true);
    setError(null);
    setNearbyHospitals([]);

    try {
      // Use a free geocoding service
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocation)}&limit=1`;

      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        if (isValidCoordinates(latitude, longitude)) {
          console.log(`Manual location found: ${latitude}, ${longitude} for "${manualLocation}"`);

          const userCoords: [number, number] = [latitude, longitude];
          setUserLocation(userCoords);

          // Fetch hospitals from API
          await fetchNearbyHospitals(latitude, longitude);
          setLoading(false);
          setShowManualInput(false);
        } else {
          throw new Error('Invalid coordinates from geocoding');
        }
      } else {
        setError(`Location "${manualLocation}" not found. Please try a different location or be more specific.`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Manual location search error:', error);
      setError(`Unable to find location "${manualLocation}". Please check the spelling and try again.`);
      setLoading(false);
    }
  };

  // Don't auto-load on mount, let user click the button
  // useEffect(() => {
  //   getUserLocation();
  // }, []);



  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Nearest Hospitals</h2>
      <p className="text-slate-600 mb-6">
        Find hospitals and medical centers near your current location. Results are automatically sorted by distance with accurate driving distances, ratings, and turn-by-turn directions powered by Google Maps.
      </p>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            <MapPin className="h-5 w-5 mr-2" />
            {loading ? 'Finding Hospitals...' : 'Use My Current Location'}
          </button>

          <button
            onClick={() => setShowManualInput(!showManualInput)}
            disabled={loading}
            className="btn btn-secondary flex-1"
          >
            <Search className="h-5 w-5 mr-2" />
            Search by Location
          </button>
        </div>

        {/* Manual location input */}
        {showManualInput && (
          <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="e.g., New York, NY or Bangalore, India"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && searchManualLocation()}
                disabled={loading}
              />
              <button
                onClick={searchManualLocation}
                disabled={loading || !manualLocation.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter a city, address, or landmark to find hospitals in that area
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-error-50 border border-error-200 rounded-md p-3 text-sm text-error-800">
            <strong>Error:</strong> {error}
            <div className="mt-2 text-xs">
              💡 <strong>Tip:</strong> Please allow location access when prompted by your browser.
            </div>
          </div>
        )}

        {userLocation && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="text-sm text-green-800">
              📍 <strong>Your Location:</strong> {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </div>
            {nearbyHospitals.length > 0 && (
              <div className="text-sm text-green-700 mt-1">
                ✅ Found {nearbyHospitals.length} hospitals near you, sorted by distance
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Hospital list */}
      {nearbyHospitals.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Hospitals Near You (Sorted by Distance)
          </h3>
          <p className="text-sm text-slate-600">
            Showing {nearbyHospitals.length} hospitals within 25km of your location
          </p>
        </div>
      )}

      <div className="space-y-4">
        {nearbyHospitals.length === 0 && !loading ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No hospitals found</h3>
            <p className="text-slate-500">
              Click "Find Nearest Hospitals" to locate hospitals near you
            </p>
          </div>
        ) : (
          nearbyHospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {index + 1}. {hospital.name}
                  </h3>
                  <p className="text-slate-600 mb-2">{hospital.address}</p>

                  {/* Rating */}
                  {hospital.rating && hospital.rating > 0 && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(hospital.rating!)
                                ? 'text-yellow-400 fill-current'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-slate-600">
                        {hospital.rating.toFixed(1)} ({hospital.user_ratings_total || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-primary-600">
                    {hospital.distance_text || `${hospital.distance?.toFixed(1)} km`}
                  </div>
                  {hospital.duration_text && hospital.duration_text !== 'N/A' && (
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {hospital.duration_text}
                    </div>
                  )}
                </div>
              </div>

              {/* Directions Button */}
              {hospital.directions_url && (
                <div className="flex justify-end">
                  <a
                    href={hospital.directions_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalFinder;