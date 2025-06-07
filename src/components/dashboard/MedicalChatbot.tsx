import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Info } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Mock response function (in a real app, this would call an API)
const getMockBotResponse = async (message: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple keyword-based responses
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your medical assistant. How can I help you today?";
  }
  
  if (lowerMessage.includes('eczema') || lowerMessage.includes('atopic dermatitis')) {
    return "Eczema (atopic dermatitis) is a condition that makes your skin red and itchy. It's common in children but can occur at any age. Moisturizing regularly, avoiding harsh soaps, and using medicated creams or ointments can help manage symptoms. If your eczema is severe, you might need prescription medications.";
  }
  
  if (lowerMessage.includes('psoriasis')) {
    return "Psoriasis is a skin disease that causes red, itchy scaly patches, most commonly on the knees, elbows, trunk and scalp. Treatment typically involves creams, light therapy, and sometimes medications that reduce immune system activity. Lifestyle changes like reducing stress and not smoking may also help manage symptoms.";
  }
  
  if (lowerMessage.includes('acne')) {
    return "Acne is a skin condition that occurs when hair follicles plug with oil and dead skin cells. Treatments include over-the-counter products with ingredients like benzoyl peroxide or salicylic acid. For more severe acne, prescription medications may be necessary. It's important to be gentle with your skin and avoid picking or squeezing pimples.";
  }
  
  if (lowerMessage.includes('rash') || lowerMessage.includes('itchy')) {
    return "Skin rashes can be caused by many things, including allergies, medications, infections, and autoimmune conditions. If your rash is painful, widespread, or accompanied by fever, you should seek medical attention. For mild rashes, avoiding irritants and using over-the-counter hydrocortisone cream may help.";
  }
  
  if (lowerMessage.includes('sunburn') || lowerMessage.includes('sun protection')) {
    return "Sunburn is caused by overexposure to UV rays and can lead to skin damage and increased risk of skin cancer. To prevent sunburn, use broad-spectrum sunscreen with SPF 30 or higher, wear protective clothing, and limit sun exposure, especially between 10 AM and 4 PM. For treating sunburn, take cool baths, use moisturizers with aloe vera, and take anti-inflammatory medications if needed.";
  }
  
  if (lowerMessage.includes('dermatologist') || lowerMessage.includes('doctor')) {
    return "You should see a dermatologist if you have: persistent skin problems that don't respond to over-the-counter treatments, concerning changes in moles or skin growths, severe acne, unexplained hair loss, or painful rashes. The hospital finder feature in this app can help you locate dermatologists near you.";
  }
  
  // Default response for unrecognized queries
  return "I don't have specific information about that skin condition or question. For accurate diagnosis and treatment advice, please consult with a healthcare professional. You can use our Hospital Finder feature to locate specialists near you.";
};

const MedicalChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your medical assistant. I can answer questions about skin conditions, treatments, and general healthcare information. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const response = await getMockBotResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <h2 className="text-2xl font-bold mb-4">Medical Assistant</h2>
      
      <div className="bg-slate-50 p-4 rounded-md mb-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
          <div>
            <p className="text-slate-700">
              This medical assistant can answer questions about skin conditions, treatments, and general healthcare information.
            </p>
            <p className="text-slate-500 text-sm mt-1">
              <strong>Note:</strong> This is not a substitute for professional medical advice. For medical emergencies, please call your local emergency number.
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto border border-slate-200 rounded-t-lg bg-white">
        <div className="p-4 space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary-100 text-primary-900' 
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'bot' ? (
                    <Bot className="h-4 w-4 mr-2 text-primary-600" />
                  ) : (
                    <User className="h-4 w-4 mr-2 text-primary-600" />
                  )}
                  <span className="font-medium text-sm">
                    {message.sender === 'user' ? 'You' : 'Medical Assistant'}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-warning-50 border-x border-t border-warning-200 p-3">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-warning-600 mr-2 shrink-0 mt-0.5" />
          <p className="text-sm text-warning-800">
            The information provided by this assistant is for general informational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider.
          </p>
        </div>
      </div>
      
      {/* Input area */}
      <div className="border border-slate-200 rounded-b-lg bg-white p-3 flex items-end">
        <textarea 
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your medical question here..."
          className="flex-1 resize-none border-0 bg-transparent p-2 focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-400"
          rows={2}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className={`ml-2 p-2 rounded-full ${
            inputMessage.trim() && !isTyping 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MedicalChatbot;