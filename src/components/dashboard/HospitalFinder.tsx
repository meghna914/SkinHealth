import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Phone, Globe, Clock, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Type for the hospital data
type Hospital = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  website: string;
  specialties: string[];
  rating: number;
  hours: string;
  distance?: number; // Distance from user's location in km
};

// Mock hospital data
const mockHospitals: Hospital[] = [
  {
    id: 1,
    name: "City General Hospital",
    lat: 40.7128,
    lng: -74.006,
    address: "123 Healthcare Ave, New York, NY",
    phone: "+1 (212) 555-1234",
    website: "https://citygeneralhospital.org",
    specialties: ["Dermatology", "General Medicine", "Pediatrics"],
    rating: 4.2,
    hours: "Mon-Fri: 8AM-8PM, Sat-Sun: 10AM-6PM",
  },
  {
    id: 2,
    name: "Westside Medical Center",
    lat: 40.7138,
    lng: -74.016,
    address: "456 Medical Blvd, New York, NY",
    phone: "+1 (212) 555-5678",
    website: "https://westsidemedical.org",
    specialties: ["Dermatology", "Oncology", "Cardiology"],
    rating: 4.5,
    hours: "24/7",
  },
  {
    id: 3,
    name: "Eastside Clinic",
    lat: 40.7148,
    lng: -73.996,
    address: "789 Health St, New York, NY",
    phone: "+1 (212) 555-9012",
    website: "https://eastsideclinic.org",
    specialties: ["Dermatology", "Allergy & Immunology"],
    rating: 3.9,
    hours: "Mon-Fri: 9AM-5PM",
  },
  {
    id: 4,
    name: "Uptown Dermatology Center",
    lat: 40.7218,
    lng: -73.986,
    address: "321 Skin Care Ln, New York, NY",
    phone: "+1 (212) 555-3456",
    website: "https://uptownderm.org",
    specialties: ["Dermatology"],
    rating: 4.8,
    hours: "Mon-Fri: 8AM-6PM, Sat: 10AM-2PM",
  },
  {
    id: 5,
    name: "Downtown Health Clinic",
    lat: 40.7058,
    lng: -74.016,
    address: "555 Wellness Way, New York, NY",
    phone: "+1 (212) 555-7890",
    website: "https://downtownhealth.org",
    specialties: ["General Medicine", "Dermatology", "Mental Health"],
    rating: 4.0,
    hours: "Mon-Fri: 7AM-7PM",
  },
];

// Component to recenter map when user location changes
const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

const HospitalFinder = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          findNearbyHospitals([latitude, longitude]);
          setLoading(false);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to access your location. Please allow location access or enter a location manually.');
          setLoading(false);
          
          // Default to New York City if location access is denied
          const defaultLocation: [number, number] = [40.7128, -74.006];
          setUserLocation(defaultLocation);
          findNearbyHospitals(defaultLocation);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      
      // Default to New York City
      const defaultLocation: [number, number] = [40.7128, -74.006];
      setUserLocation(defaultLocation);
      findNearbyHospitals(defaultLocation);
    }
  };

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  // Find nearby hospitals based on user location
  const findNearbyHospitals = (location: [number, number]) => {
    const [userLat, userLng] = location;
    
    // Calculate distance for each hospital
    const hospitalsWithDistance = mockHospitals.map(hospital => {
      const distance = calculateDistance(userLat, userLng, hospital.lat, hospital.lng);
      return { ...hospital, distance };
    });
    
    // Sort by distance
    const sortedHospitals = hospitalsWithDistance.sort((a, b) => 
      (a.distance || 0) - (b.distance || 0)
    );
    
    setNearbyHospitals(sortedHospitals);
  };

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Filter hospitals by search term and specialty
  const filteredHospitals = nearbyHospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === '' || 
                            hospital.specialties.some(s => s.toLowerCase() === specialtyFilter.toLowerCase());
    
    return matchesSearch && matchesSpecialty;
  });

  // Extract unique specialties for filter dropdown
  const allSpecialties = Array.from(
    new Set(
      nearbyHospitals.flatMap(hospital => hospital.specialties)
    )
  ).sort();

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-warning-500 fill-warning-500' : 'text-slate-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hospital Finder</h2>
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
              Search Hospitals
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or address"
              className="input w-full"
            />
          </div>
          
          <div className="md:w-1/3">
            <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-1">
              Filter by Specialty
            </label>
            <select
              id="specialty"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="input w-full"
            >
              <option value="">All Specialties</option>
              {allSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          
          <div className="md:w-auto self-end">
            <button 
              onClick={getUserLocation}
              disabled={loading}
              className="btn btn-primary w-full md:w-auto"
            >
              <Navigation className="h-5 w-5 mr-2" />
              {loading ? 'Getting Location...' : 'Use My Location'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-md p-3 text-sm text-error-800">
            {error}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hospital list */}
        <div className="lg:col-span-1 order-2 lg:order-1 h-[400px] lg:h-[600px] overflow-y-auto pr-2">
          {filteredHospitals.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-1">No hospitals found</h3>
              <p className="text-slate-500">
                Try adjusting your search or filters to find more results
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHospitals.map(hospital => (
                <div 
                  key={hospital.id}
                  className={`rounded-lg p-4 cursor-pointer transition-all ${
                    selectedHospital?.id === hospital.id 
                      ? 'bg-primary-50 border border-primary-200 shadow-sm' 
                      : 'bg-white border border-slate-200 hover:border-primary-200 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <h3 className="font-semibold text-lg mb-1">{hospital.name}</h3>
                  <p className="text-slate-600 text-sm mb-2">{hospital.address}</p>
                  
                  <div className="flex items-center text-sm text-slate-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                    <span>
                      {hospital.distance !== undefined 
                        ? `${hospital.distance.toFixed(1)} km away` 
                        : 'Distance unknown'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    {renderRating(hospital.rating)}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hospital.specialties.map(specialty => (
                      <span 
                        key={specialty} 
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Map */}
        <div className="lg:col-span-2 order-1 lg:order-2 h-[300px] lg:h-[600px] rounded-lg overflow-hidden border border-slate-200">
          {userLocation ? (
            <MapContainer 
              center={userLocation} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User marker */}
              <Marker position={userLocation}>
                <Popup>
                  Your location
                </Popup>
              </Marker>
              
              {/* Hospital markers */}
              {filteredHospitals.map(hospital => (
                <Marker 
                  key={hospital.id}
                  position={[hospital.lat, hospital.lng]}
                  eventHandlers={{
                    click: () => {
                      setSelectedHospital(hospital);
                    },
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-semibold">{hospital.name}</h3>
                      <p className="text-sm">{hospital.address}</p>
                      {hospital.distance !== undefined && (
                        <p className="text-sm text-slate-600">
                          {hospital.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Recenter map when user location changes */}
              <RecenterMap position={userLocation} />
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-50">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-700">
                  {loading ? 'Getting your location...' : 'Allow location access to view the map'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Selected hospital details */}
      {selectedHospital && (
        <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">{selectedHospital.name}</h3>
              <p className="text-slate-600">{selectedHospital.address}</p>
            </div>
            <button 
              onClick={() => setSelectedHospital(null)} 
              className="text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium">{selectedHospital.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Website</p>
                <a 
                  href={selectedHospital.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Visit website
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Hours</p>
                <p className="font-medium">{selectedHospital.hours}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Star className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Rating</p>
                <div className="mt-1">
                  {renderRating(selectedHospital.rating)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {selectedHospital.specialties.map(specialty => (
                <span 
                  key={specialty} 
                  className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Get Directions
            </a>
            
            <a 
              href={`tel:${selectedHospital.phone}`}
              className="btn btn-outline inline-flex items-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalFinder;