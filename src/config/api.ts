// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    HEALTH: '/health',
    CONFIG: '/config',
    ML_MODEL_CONFIG: '/ml-model/config',
    PREDICT: '/predict',
    HOSPITALS_NEARBY: '/hospitals/nearby',
    CHATBOT_MESSAGE: '/chatbot/message',
    CHATBOT_TEST: '/chatbot/test',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API utility functions
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export default API_CONFIG;
