import { useState, useRef } from 'react';
import { Upload, FileImage, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

type ClassificationResult = {
  condition: string;
  confidence: number;
  description: string;
  treatment: string;
};

const DiseaseClassifier = () => {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock classification function (in a real app, this would call an API)
  const classifySkin = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - in a real app this would come from the API
      const mockResults: ClassificationResult[] = [
        {
          condition: "Eczema (Atopic Dermatitis)",
          confidence: 0.89,
          description: "A chronic skin condition characterized by red, itchy, and inflamed skin. Common in individuals with a history of allergies or asthma.",
          treatment: "Topical corticosteroids, moisturizers, avoiding triggers, antihistamines for itching, and in severe cases, immunosuppressants or phototherapy."
        },
        {
          condition: "Psoriasis",
          confidence: 0.78,
          description: "A chronic autoimmune condition causing rapid skin cell buildup, resulting in thick, red patches with silvery scales. Often occurs on elbows, knees, and scalp.",
          treatment: "Topical treatments, phototherapy, oral medications, and biologics targeting specific parts of the immune system."
        },
        {
          condition: "Acne Vulgaris",
          confidence: 0.92,
          description: "A common skin condition characterized by pimples, blackheads, and whiteheads due to clogged hair follicles with oil and dead skin cells.",
          treatment: "Topical retinoids, benzoyl peroxide, antibiotics, salicylic acid, and for severe cases, oral isotretinoin or hormonal therapy."
        }
      ];
      
      // Randomly select one result
      const randomIndex = Math.floor(Math.random() * mockResults.length);
      setResult(mockResults[randomIndex]);
    } catch (err) {
      console.error('Error classifying image:', err);
      setError('Failed to analyze the image. Please try again.');
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
      <h2 className="text-2xl font-bold mb-6">Skin Disease Classification</h2>
      
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