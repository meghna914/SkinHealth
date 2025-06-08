import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { buildApiUrl, API_CONFIG } from '../../config/api';

type ConfigStatus = {
  configured: boolean;
  ngrok_url: string | null;
  message: string;
};

const ModelConfig = () => {
  const [ngrokUrl, setNgrokUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load current configuration on component mount
  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ML_MODEL_CONFIG));
      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
        if (data.ngrok_url) {
          setNgrokUrl(data.ngrok_url);
        }
      } else {
        setError('Failed to load configuration');
      }
    } catch (err) {
      console.error('Error loading config:', err);
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    if (!ngrokUrl.trim()) {
      setError('Please enter a valid ngrok URL');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ML_MODEL_CONFIG), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ngrok_url: ngrokUrl.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Configuration saved successfully!');
        await loadCurrentConfig(); // Reload to get updated status
      } else {
        setError(data.error || 'Failed to save configuration');
      }
    } catch (err) {
      console.error('Error saving config:', err);
      setError('Failed to connect to backend');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!ngrokUrl.trim()) {
      setError('Please enter a valid ngrok URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Test if the URL is accessible
      const testUrl = ngrokUrl.trim().replace(/\/$/, ''); // Remove trailing slash
      const response = await fetch(testUrl, { 
        method: 'GET',
        mode: 'no-cors' // This will prevent CORS issues for testing
      });
      
      setSuccess('URL appears to be accessible');
    } catch (err) {
      console.error('Error testing connection:', err);
      setError('Could not connect to the provided URL. Please check if your ML model server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-primary-100 rounded-full p-2">
          <Settings className="h-6 w-6 text-primary-700" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">ML Model Configuration</h3>
          <p className="text-slate-500">Configure your ngrok URL for skin disease classification</p>
        </div>
      </div>

      {/* Current Status */}
      {status && (
        <div className={`border rounded-lg p-4 ${
          status.configured 
            ? 'bg-success-50 border-success-200' 
            : 'bg-warning-50 border-warning-200'
        }`}>
          <div className="flex items-center space-x-2">
            {status.configured ? (
              <CheckCircle2 className="h-5 w-5 text-success-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-warning-600" />
            )}
            <span className={`font-medium ${
              status.configured ? 'text-success-800' : 'text-warning-800'
            }`}>
              {status.message}
            </span>
          </div>
          {status.configured && status.ngrok_url && (
            <div className="mt-2 text-sm text-success-700">
              Current URL: <code className="bg-success-100 px-2 py-1 rounded">{status.ngrok_url}</code>
            </div>
          )}
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="ngrok-url" className="block text-sm font-medium text-slate-700 mb-2">
              Ngrok URL
            </label>
            <input
              id="ngrok-url"
              type="url"
              value={ngrokUrl}
              onChange={(e) => setNgrokUrl(e.target.value)}
              placeholder="https://your-ngrok-url.ngrok.io"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={saving || loading}
            />
            <p className="mt-1 text-sm text-slate-500">
              Enter the ngrok URL where your ML model is hosted (e.g., https://abc123.ngrok.io)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-md p-3">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-error-600 mt-0.5 mr-2" />
                <p className="text-error-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-success-50 border border-success-200 rounded-md p-3">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-success-600 mt-0.5 mr-2" />
                <p className="text-success-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={saveConfiguration}
              disabled={saving || loading || !ngrokUrl.trim()}
              className="btn btn-primary inline-flex items-center"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            
            <button
              onClick={testConnection}
              disabled={loading || saving || !ngrokUrl.trim()}
              className="btn btn-outline inline-flex items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          <li>Start your ML model server locally</li>
          <li>Run ngrok to expose your local server: <code className="bg-slate-200 px-1 rounded">ngrok http 5000</code></li>
          <li>Copy the ngrok URL (e.g., https://abc123.ngrok.io)</li>
          <li>Paste the URL above and click "Save Configuration"</li>
          <li>Your model endpoint should be available at: <code className="bg-slate-200 px-1 rounded">{ngrokUrl || 'your-ngrok-url'}/predict</code></li>
        </ol>
      </div>
    </div>
  );
};

export default ModelConfig;
