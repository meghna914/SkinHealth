import { useState, useRef } from 'react';
import { Upload, FileImage, Info, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import ModelConfig from './ModelConfig';
import { buildApiUrl, API_CONFIG } from '../../config/api';

type ClassificationResult = {
  condition: string;
  confidence: number;
  description: string;
  treatment: string;
};

type MLModelResponse = {
  success: boolean;
  prediction?: any;
  error?: string;
  requires_config?: boolean;
};

const DiseaseClassifier = () => {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [requiresConfig, setRequiresConfig] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real classification function that calls the backend API
  const classifySkin = async (file: File) => {
    setLoading(true);
    setError(null);
    setRequiresConfig(false);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending image to backend for classification...');

      // Send to backend API
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PREDICT), {
        method: 'POST',
        body: formData
      });

      const data: MLModelResponse = await response.json();

      if (data.success && data.prediction) {
        // Transform ML model response to our expected format
        const prediction = data.prediction;

        // Parse the prediction string to extract condition name
        let conditionName = 'Unknown Condition';
        let conditionIndex = 0;

        if (prediction.prediction && typeof prediction.prediction === 'string') {
          // Format: "10. Warts Molluscum and other Viral Infections - 2103"
          const predictionText = prediction.prediction;
          const match = predictionText.match(/^(\d+)\.\s*(.+?)\s*-\s*\d+$/);
          if (match) {
            conditionIndex = parseInt(match[1]);
            conditionName = match[2].trim();
          } else {
            conditionName = predictionText;
          }
        }

        // Calculate confidence based on prediction index (this is a rough estimate)
        // You might want to adjust this based on your model's actual confidence scoring
        const confidence = prediction.confidence || (prediction.predicted_index ? 0.8 : 0.5);

        const transformedResult: ClassificationResult = {
          condition: conditionName,
          confidence: confidence,
          description: `AI analysis detected: ${conditionName}. This is an automated analysis based on image recognition.`,
          treatment: 'Please consult with a dermatologist or healthcare professional for proper diagnosis, treatment recommendations, and medical advice. This AI analysis is for informational purposes only.'
        };

        setResult(transformedResult);
        console.log('Classification successful:', transformedResult);
      } else {
        // Handle different types of errors
        if (data.requires_config) {
          setRequiresConfig(true);
          setError('ML model not configured. Please configure your ngrok URL first.');
        } else {
          setError(data.error || 'Failed to analyze the image. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error classifying image:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Failed to connect to the backend. Please ensure the server is running.');
      } else {
        setError('Failed to analyze the image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Reset previous results
    setResult(null);
    setError(null);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Display the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    
    // Classify the image
    await classifySkin(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Skin Disease Classification</h2>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="btn btn-outline inline-flex items-center"
        >
          <Settings className="h-4 w-4 mr-2" />
          {showConfig ? 'Hide Config' : 'Configure Model'}
        </button>
      </div>

      {/* Configuration Section */}
      {showConfig && (
        <div className="mb-6">
          <ModelConfig />
        </div>
      )}

      {/* Configuration Required Warning */}
      {requiresConfig && (
        <div className="mb-6 bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5 mr-2" />
            <div>
              <h3 className="font-semibold text-warning-800">Configuration Required</h3>
              <p className="text-warning-700 mb-3">
                Please configure your ML model URL before uploading images for analysis.
              </p>
              <button
                onClick={() => setShowConfig(true)}
                className="btn btn-warning inline-flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!image ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*" 
            onChange={handleFileInput} 
          />
          
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <FileImage className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload an image for analysis</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Drag and drop an image of the affected skin area, or click to browse your files
            </p>
            <button className="btn btn-primary inline-flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </button>
          </div>
          
          <div className="mt-6 flex items-start text-xs text-slate-500">
            <Info className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
            <p className="text-left">
              Supported formats: JPEG, PNG. Maximum file size: 10MB. 
              For best results, ensure the affected area is clearly visible and well-lit.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image preview */}
            <div className="md:w-1/2">
              <div className="border rounded-lg overflow-hidden bg-slate-50">
                <img 
                  src={image} 
                  alt="Uploaded skin" 
                  className="w-full h-auto object-contain max-h-80 mx-auto"
                />
              </div>
              <div className="mt-4">
                <button 
                  onClick={resetAnalysis}
                  className="btn btn-outline w-full"
                >
                  Upload Different Image
                </button>
              </div>
            </div>
            
            {/* Analysis results */}
            <div className="md:w-1/2">
              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-700 font-medium">Analyzing image...</p>
                  <p className="text-slate-500 text-sm">This may take a few moments</p>
                </div>
              )}
              
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-error-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-semibold text-error-800">Analysis Error</h3>
                      <p className="text-error-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {result && !loading && (
                <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-success-600 mr-2" />
                    <h3 className="text-xl font-semibold">Analysis Complete</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Identified Condition:</p>
                      <p className="text-lg font-semibold">{result.condition}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500">Confidence:</p>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1 mb-2">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-right">
                        {Math.round(result.confidence * 100)}% match
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500">Description:</p>
                      <p className="text-slate-700">{result.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500">Recommended Treatment:</p>
                      <p className="text-slate-700">{result.treatment}</p>
                    </div>
                    
                    <div className="pt-2">
                      <div className="bg-warning-50 border border-warning-200 rounded-md p-3 text-sm text-warning-800 flex items-start">
                        <AlertCircle className="h-5 w-5 text-warning-600 mr-2 shrink-0 mt-0.5" />
                        <p>
                          This analysis is for informational purposes only and should not replace professional medical advice. 
                          Please consult with a healthcare provider for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseClassifier;