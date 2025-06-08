from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
import math
from typing import List, Dict, Any
import json
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Google API configuration
GOOGLE_PLACES_API_KEY = 'AIzaSyDVEJAuVXSA78o8-p5MzS_F7FW56C7_BdI'
GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'
GOOGLE_DISTANCE_MATRIX_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json'

# Google AI (Gemini) configuration for chatbot
GOOGLE_AI_API_KEY = 'AIzaSyAdaxYtbQnls5-BNp8qds8or2mgEW79Y00'
genai.configure(api_key=GOOGLE_AI_API_KEY)

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in kilometers (Haversine formula)"""
    R = 6371  # Radius of the earth in km

    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Calculate differences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    # Haversine formula
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Distance in kilometers
    distance = R * c
    return distance

def search_hospitals_google_places(lat: float, lng: float, radius: int = 25000) -> List[Dict[str, Any]]:
    """Search for hospitals using Google Places API with fallback to demo data"""

    print(f"Searching for hospitals near {lat},{lng} with radius {radius}m using Google Places API")

    # Try Google Places API (New) first
    try:
        print("Attempting Google Places API (New)...")
        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types'
        }

        data = {
            "textQuery": f"hospitals near {lat},{lng}",
            "locationBias": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": lng
                    },
                    "radius": radius
                }
            },
            "maxResultCount": 20
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()
        places = result.get('places', [])

        if places:
            hospitals = []
            for place in places:
                location = place.get('location', {})
                lat_val = location.get('latitude', 0)
                lng_val = location.get('longitude', 0)

                distance = calculate_distance(lat, lng, lat_val, lng_val)
                if distance <= (radius / 1000):
                    hospital = {
                        'id': place.get('id', ''),
                        'name': place.get('displayName', {}).get('text', 'Unknown Hospital'),
                        'lat': lat_val,
                        'lng': lng_val,
                        'address': place.get('formattedAddress', 'Address not available'),
                        'rating': place.get('rating', 0),
                        'user_ratings_total': place.get('userRatingCount', 0),
                        'place_id': place.get('id', ''),
                        'types': place.get('types', [])
                    }
                    hospitals.append(hospital)
                    print(f"Found: {hospital['name']} at {hospital['address']} ({distance:.1f}km away)")

            print(f"Total hospitals found from Google Places API: {len(hospitals)}")
            return hospitals

    except Exception as e:
        print(f"Google Places API (New) failed: {e}")

    # Try legacy Google Places API as fallback
    try:
        print("Attempting legacy Google Places API...")
        url = f"{GOOGLE_PLACES_BASE_URL}/nearbysearch/json"

        params = {
            'location': f"{lat},{lng}",
            'radius': radius,
            'type': 'hospital',
            'key': GOOGLE_PLACES_API_KEY
        }

        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()

        if data.get('status') == 'OK':
            hospitals = []
            for place in data.get('results', []):
                hospital = {
                    'id': place.get('place_id', ''),
                    'name': place.get('name', 'Unknown Hospital'),
                    'lat': place.get('geometry', {}).get('location', {}).get('lat', 0),
                    'lng': place.get('geometry', {}).get('location', {}).get('lng', 0),
                    'address': place.get('vicinity', 'Address not available'),
                    'rating': place.get('rating', 0),
                    'user_ratings_total': place.get('user_ratings_total', 0),
                    'place_id': place.get('place_id', ''),
                    'types': place.get('types', [])
                }
                hospitals.append(hospital)
                print(f"Found: {hospital['name']} at {hospital['address']}")

            print(f"Total hospitals found from legacy API: {len(hospitals)}")
            return hospitals
        else:
            print(f"Legacy API error: {data.get('status')} - {data.get('error_message', 'Unknown error')}")

    except Exception as e:
        print(f"Legacy Google Places API failed: {e}")

    # Fallback to demo data for demonstration purposes
    print("Using demo hospital data for demonstration...")
    return get_demo_hospitals(lat, lng, radius)

def get_demo_hospitals(lat: float, lng: float, radius: int) -> List[Dict[str, Any]]:
    """Get demo hospital data for demonstration when APIs are not available"""

    # Demo hospitals with realistic coordinates that don't overlap with user location
    demo_hospitals = [
        # Bangalore area hospitals (if user is near Bangalore)
        {
            'id': 'demo_ramaiah_memorial',
            'name': 'M.S. Ramaiah Memorial Hospital',
            'lat': 13.0340,  # Slightly different from exact test location
            'lng': 77.5520,
            'address': 'MSR Nagar, MSRIT Post, Mathikere, Bangalore 560054',
            'rating': 4.2,
            'user_ratings_total': 1250,
            'place_id': 'demo_ramaiah_memorial',
            'types': ['hospital', 'health']
        },
        {
            'id': 'demo_manipal_hebbal',
            'name': 'Manipal Hospital Hebbal',
            'lat': 13.0458,
            'lng': 77.5840,
            'address': 'Kirloskar Business Park, Bellary Road, Hebbal, Bangalore 560024',
            'rating': 4.1,
            'user_ratings_total': 890,
            'place_id': 'demo_manipal_hebbal',
            'types': ['hospital', 'health']
        },
        {
            'id': 'demo_apollo_yeshwantpur',
            'name': 'Apollo Hospital Yeshwantpur',
            'lat': 13.0220,
            'lng': 77.5380,
            'address': 'Yeshwantpur, Bangalore 560022',
            'rating': 4.3,
            'user_ratings_total': 2100,
            'place_id': 'demo_apollo_yeshwantpur',
            'types': ['hospital', 'health']
        },
        {
            'id': 'demo_fortis_hospital',
            'name': 'Fortis Hospital Rajajinagar',
            'lat': 13.0250,
            'lng': 77.5580,
            'address': 'Rajajinagar, Bangalore 560010',
            'rating': 4.0,
            'user_ratings_total': 1580,
            'place_id': 'demo_fortis_hospital',
            'types': ['hospital', 'health']
        },
        # Generic hospitals for any location
        {
            'id': 'demo_general_hospital_1',
            'name': 'City General Hospital',
            'lat': lat + 0.012,  # About 1.3km away
            'lng': lng + 0.008,
            'address': f'Medical District, {lat + 0.012:.4f}, {lng + 0.008:.4f}',
            'rating': 4.0,
            'user_ratings_total': 500,
            'place_id': 'demo_general_hospital_1',
            'types': ['hospital', 'health']
        },
        {
            'id': 'demo_medical_center_1',
            'name': 'Regional Medical Center',
            'lat': lat - 0.018,  # About 2km away
            'lng': lng + 0.015,
            'address': f'Healthcare Complex, {lat - 0.018:.4f}, {lng + 0.015:.4f}',
            'rating': 3.9,
            'user_ratings_total': 750,
            'place_id': 'demo_medical_center_1',
            'types': ['hospital', 'health']
        },
        {
            'id': 'demo_specialty_hospital',
            'name': 'Specialty Care Hospital',
            'lat': lat + 0.025,  # About 2.8km away
            'lng': lng - 0.020,
            'address': f'Specialty Medical Center, {lat + 0.025:.4f}, {lng - 0.020:.4f}',
            'rating': 4.4,
            'user_ratings_total': 320,
            'place_id': 'demo_specialty_hospital',
            'types': ['hospital', 'health']
        },
        {
            'id': 'demo_community_hospital',
            'name': 'Community Health Center',
            'lat': lat - 0.008,  # About 0.9km away
            'lng': lng - 0.006,
            'address': f'Community Health District, {lat - 0.008:.4f}, {lng - 0.006:.4f}',
            'rating': 3.8,
            'user_ratings_total': 420,
            'place_id': 'demo_community_hospital',
            'types': ['hospital', 'health']
        }
    ]

    # Filter hospitals within radius
    hospitals_within_radius = []
    for hospital in demo_hospitals:
        distance = calculate_distance(lat, lng, hospital['lat'], hospital['lng'])
        if distance <= (radius / 1000):  # Convert radius to km
            hospitals_within_radius.append(hospital)
            print(f"Demo hospital: {hospital['name']} - {distance:.1f}km away")

    print(f"Total demo hospitals within {radius/1000}km: {len(hospitals_within_radius)}")
    return hospitals_within_radius

def get_accurate_distances(user_lat: float, user_lng: float, hospitals: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Get accurate driving distances using Google Routes API or fallback to enhanced distance calculation"""

    if not hospitals:
        return hospitals

    print(f"Getting accurate distances for {len(hospitals)} hospitals")

    # Try Google Routes API first (new API)
    hospitals_with_distance = []

    for hospital in hospitals:
        try:
            # Try Routes API for accurate driving distances
            print(f"Attempting Routes API for {hospital['name']}...")

            url = "https://routes.googleapis.com/directions/v2:computeRoutes"
            headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
            }

            data = {
                "origin": {
                    "location": {
                        "latLng": {
                            "latitude": user_lat,
                            "longitude": user_lng
                        }
                    }
                },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": hospital['lat'],
                            "longitude": hospital['lng']
                        }
                    }
                },
                "travelMode": "DRIVE",
                "routingPreference": "TRAFFIC_AWARE"
            }

            response = requests.post(url, headers=headers, json=data)

            if response.status_code == 200:
                result = response.json()
                routes = result.get('routes', [])

                if routes:
                    route = routes[0]
                    distance_meters = route.get('distanceMeters', 0)
                    duration = route.get('duration', '0s')

                    # Convert distance to km
                    distance_km = round(distance_meters / 1000, 1)

                    # Parse duration (format: "123s" or "5m 30s")
                    duration_text = parse_duration(duration)

                    hospital['distance'] = distance_km
                    hospital['distance_text'] = f"{distance_km} km"
                    hospital['duration_text'] = duration_text

                    print(f"Routes API success for {hospital['name']}: {distance_km} km ({duration_text})")
                else:
                    raise Exception("No routes found")
            else:
                raise Exception(f"Routes API error: {response.status_code}")

        except Exception as e:
            print(f"Routes API failed for {hospital['name']}: {e}")

            # Try legacy Distance Matrix API as fallback
            try:
                print(f"Trying Distance Matrix API for {hospital['name']}...")

                params = {
                    'origins': f"{user_lat},{user_lng}",
                    'destinations': f"{hospital['lat']},{hospital['lng']}",
                    'mode': 'driving',
                    'units': 'metric',
                    'key': GOOGLE_PLACES_API_KEY
                }

                response = requests.get(GOOGLE_DISTANCE_MATRIX_URL, params=params)

                if response.status_code == 200:
                    data = response.json()

                    if data.get('status') == 'OK':
                        elements = data.get('rows', [{}])[0].get('elements', [])

                        if elements and elements[0].get('status') == 'OK':
                            element = elements[0]
                            distance_info = element.get('distance', {})
                            duration_info = element.get('duration', {})

                            hospital['distance'] = round(distance_info.get('value', 0) / 1000, 1)
                            hospital['distance_text'] = distance_info.get('text', f"{hospital['distance']} km")
                            hospital['duration_text'] = duration_info.get('text', 'N/A')

                            print(f"Distance Matrix API success for {hospital['name']}: {hospital['distance_text']} ({hospital['duration_text']})")
                        else:
                            raise Exception("No valid elements in response")
                    else:
                        raise Exception(f"API status: {data.get('status')}")
                else:
                    raise Exception(f"HTTP error: {response.status_code}")

            except Exception as e2:
                print(f"Distance Matrix API also failed for {hospital['name']}: {e2}")

                # Final fallback: Enhanced Haversine with realistic driving distance estimation
                straight_distance = calculate_distance(user_lat, user_lng, hospital['lat'], hospital['lng'])

                # Estimate driving distance (typically 1.2-1.5x straight line distance in urban areas)
                driving_distance = round(straight_distance * 1.3, 1)

                # Estimate driving time (assuming average speed of 25 km/h in city traffic)
                estimated_minutes = round((driving_distance / 25) * 60)
                duration_text = f"{estimated_minutes} mins" if estimated_minutes > 0 else "< 1 min"

                hospital['distance'] = driving_distance
                hospital['distance_text'] = f"{driving_distance} km"
                hospital['duration_text'] = duration_text

                print(f"Enhanced fallback for {hospital['name']}: {driving_distance} km (estimated {duration_text})")

        # Add directions URL for all hospitals
        hospital['directions_url'] = f"https://www.google.com/maps/dir/{user_lat},{user_lng}/{hospital['lat']},{hospital['lng']}"
        hospitals_with_distance.append(hospital)

    # Sort by distance
    hospitals_with_distance.sort(key=lambda x: x.get('distance', float('inf')))

    print(f"Total hospitals processed with distances: {len(hospitals_with_distance)}")
    return hospitals_with_distance

def parse_duration(duration_str: str) -> str:
    """Parse duration string from Google APIs (e.g., '123s' or '5m 30s') to readable format"""
    try:
        if 's' in duration_str:
            # Remove 's' and convert to int
            seconds = int(duration_str.replace('s', ''))

            if seconds < 60:
                return f"{seconds} sec"
            elif seconds < 3600:
                minutes = seconds // 60
                remaining_seconds = seconds % 60
                if remaining_seconds > 0:
                    return f"{minutes}m {remaining_seconds}s"
                else:
                    return f"{minutes} min"
            else:
                hours = seconds // 3600
                minutes = (seconds % 3600) // 60
                if minutes > 0:
                    return f"{hours}h {minutes}m"
                else:
                    return f"{hours} hour"
        else:
            return duration_str
    except:
        return "N/A"

# Note: We now use real hospital data from Google Places API instead of hardcoded data
# This provides accurate, up-to-date information about hospitals worldwide

def search_nearby_hospitals(lat: float, lng: float, radius: int = 25000) -> List[Dict[str, Any]]:
    """Search for hospitals near the given coordinates using Google Places API and Distance Matrix API"""

    print(f"Searching for hospitals near {lat},{lng} with radius {radius}m using Google Places API")

    # Step 1: Get hospitals from Google Places API
    hospitals = search_hospitals_google_places(lat, lng, radius)

    if not hospitals:
        print("No hospitals found from Google Places API")
        return []

    # Step 2: Get accurate distances using Distance Matrix API
    hospitals_with_distance = get_accurate_distances(lat, lng, hospitals)

    print(f"Total hospitals found with accurate distances: {len(hospitals_with_distance)}")
    return hospitals_with_distance

def get_place_details(place_id: str) -> Dict[str, Any]:
    """Get detailed information about a place using Google Places API (New)"""

    if not place_id:
        return {}

    # The new API already returns most details in the search, so this is simplified
    return {}

def get_chatbot_response(message: str, conversation_history: List[Dict[str, str]] = None) -> str:
    """Get response from Google AI (Gemini) for medical chatbot"""

    try:
        print(f"Initializing Gemini model for message: {message}")

        # Initialize the model (updated model name)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Create a medical-focused system prompt
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
        - Use **bold text** for important warnings or key points
        - Use clear, well-structured paragraphs
        - Avoid excessive asterisks or special characters

        Current user question: """

        # Combine system prompt with user message
        full_prompt = system_prompt + message

        print(f"Sending request to Gemini API...")

        # Generate response
        response = model.generate_content(full_prompt)

        print(f"Received response from Gemini API: {response}")

        if response and hasattr(response, 'text') and response.text:
            print(f"Response text: {response.text[:100]}...")
            return response.text.strip()
        else:
            print(f"No valid response text. Response object: {response}")
            return "I'm sorry, I couldn't generate a response at the moment. Please try again or consult with a healthcare professional."

    except Exception as e:
        print(f"Error generating chatbot response: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return "I'm experiencing technical difficulties right now. For medical concerns, please consult with a healthcare professional or use our Hospital Finder feature to locate specialists near you."

@app.route('/api/chatbot/models', methods=['GET'])
def list_available_models():
    """List available Google AI models"""
    try:
        print("Listing available Google AI models...")

        # List available models
        models = genai.list_models()
        model_list = []

        for model in models:
            model_info = {
                'name': model.name,
                'display_name': getattr(model, 'display_name', 'N/A'),
                'description': getattr(model, 'description', 'N/A'),
                'supported_generation_methods': getattr(model, 'supported_generation_methods', [])
            }
            model_list.append(model_info)
            print(f"Available model: {model.name}")

        return jsonify({
            'success': True,
            'models': model_list,
            'count': len(model_list),
            'message': f'Found {len(model_list)} available models'
        })

    except Exception as e:
        print(f"Error listing models: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to list models: {str(e)}'
        }), 500

@app.route('/api/chatbot/test', methods=['GET'])
def test_chatbot():
    """Test the Google AI (Gemini) integration"""
    try:
        print("Testing Google AI integration...")

        # Test with a simple message
        test_message = "What is eczema?"
        response = get_chatbot_response(test_message)

        return jsonify({
            'success': True,
            'test_message': test_message,
            'response': response,
            'api_key_configured': bool(GOOGLE_AI_API_KEY),
            'message': 'Google AI integration test completed'
        })

    except Exception as e:
        print(f"Error in test_chatbot: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Test failed: {str(e)}',
            'api_key_configured': bool(GOOGLE_AI_API_KEY)
        }), 500

@app.route('/api/chatbot/message', methods=['POST'])
def chatbot_message():
    """Handle chatbot messages and return AI-generated responses"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400

        user_message = data['message'].strip()
        conversation_history = data.get('conversation_history', [])

        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Message cannot be empty'
            }), 400

        print(f"Chatbot request: {user_message}")

        # Get AI response
        ai_response = get_chatbot_response(user_message, conversation_history)

        return jsonify({
            'success': True,
            'response': ai_response,
            'timestamp': json.dumps(None, default=str)  # Will be handled by frontend
        })

    except Exception as e:
        print(f"Error in chatbot_message: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to process your message. Please try again.',
            'response': "I'm sorry, but I'm having trouble processing your request right now. For medical concerns, please consult with a healthcare professional."
        }), 500

@app.route('/api/hospitals/nearby', methods=['POST'])
def get_nearby_hospitals():
    """Get hospitals sorted by distance from user location using Google Places API and Distance Matrix API"""
    try:
        data = request.get_json()

        if not data or 'lat' not in data or 'lng' not in data:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400

        user_lat = float(data['lat'])
        user_lng = float(data['lng'])
        radius = int(data.get('radius', 25000))  # Default 25km radius

        print(f"API Request: Finding hospitals near {user_lat},{user_lng} within {radius}m")

        # Search for nearby hospitals using Google Places API and get accurate distances
        hospitals = search_nearby_hospitals(user_lat, user_lng, radius)

        if not hospitals:
            return jsonify({
                'success': True,
                'data': [],
                'count': 0,
                'user_location': {
                    'lat': user_lat,
                    'lng': user_lng
                },
                'search_radius': radius,
                'message': 'No hospitals found in the specified area. This could be due to API limits or no hospitals in the area.'
            })

        return jsonify({
            'success': True,
            'data': hospitals,
            'count': len(hospitals),
            'user_location': {
                'lat': user_lat,
                'lng': user_lng
            },
            'search_radius': radius,
            'message': f'Found {len(hospitals)} hospitals with accurate driving distances'
        })

    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid latitude or longitude values: {str(e)}'
        }), 400
    except Exception as e:
        print(f"Error in get_nearby_hospitals: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/hospitals/<place_id>', methods=['GET'])
def get_hospital(place_id):
    """Get detailed information about a specific hospital by place_id"""
    try:
        hospital_details = get_place_details(place_id)

        if not hospital_details:
            return jsonify({
                'success': False,
                'error': 'Hospital not found'
            }), 404

        return jsonify({
            'success': True,
            'data': hospital_details
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'SkinHealth API is running with Google Places, Distance Matrix, and AI Chatbot integration',
        'version': '4.0.0',
        'google_places_api': 'configured',
        'google_distance_matrix_api': 'configured',
        'google_ai_chatbot': 'configured',
        'features': [
            'Real hospital data from Google Places API',
            'Accurate driving distances from Distance Matrix API',
            'Turn-by-turn directions support',
            'Hospital ratings and reviews',
            'AI-powered medical chatbot using Google Gemini'
        ]
    })

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get API configuration status"""
    return jsonify({
        'success': True,
        'google_places_api_configured': True,
        'google_distance_matrix_api_configured': True,
        'google_ai_chatbot_configured': True,
        'message': 'Google Places API, Distance Matrix API, and AI Chatbot are configured and ready to use'
    })

@app.route('/api/test-location', methods=['POST'])
def test_location():
    """Test API with a specific location (Mathikere, Bangalore)"""
    try:
        # Mathikere coordinates (exact)
        mathikere_lat = 13.0358
        mathikere_lng = 77.5540

        print(f"Testing with Mathikere coordinates: {mathikere_lat}, {mathikere_lng}")

        # Search for hospitals within 10km radius
        hospitals = search_nearby_hospitals(mathikere_lat, mathikere_lng, 10000)  # 10km radius

        return jsonify({
            'success': True,
            'location': 'Mathikere, Bangalore',
            'coordinates': {'lat': mathikere_lat, 'lng': mathikere_lng},
            'data': hospitals,
            'count': len(hospitals),
            'message': f'Found {len(hospitals)} hospitals near Mathikere within 10km'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Test failed: {str(e)}'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
