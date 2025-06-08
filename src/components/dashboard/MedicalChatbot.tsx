import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Info } from 'lucide-react';
import { chatbotService, ChatMessage } from '../../services/chatbotService';

// Use the ChatMessage type from the service
type Message = ChatMessage;

// Real AI response function using Google Gemini
const getAIBotResponse = async (message: string, conversationHistory: Message[]): Promise<string> => {
  try {
    const response = await chatbotService.sendMessage(message, conversationHistory);

    if (response.success && response.response) {
      return response.response;
    } else {
      return response.response || "I'm sorry, but I'm having trouble processing your request right now. Please try again later.";
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "I'm experiencing technical difficulties right now. For medical concerns, please consult with a healthcare professional or use our Hospital Finder feature to locate specialists near you.";
  }
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
  const [shouldScroll, setShouldScroll] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Controlled auto-scroll to bottom of messages
  useEffect(() => {
    if (shouldScroll && messagesEndRef.current) {
      // Use a small delay to ensure the message is rendered
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
        setShouldScroll(false); // Reset scroll flag
      }, 150);
    }
  }, [shouldScroll, messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Trigger scroll after user message is added
    setTimeout(() => setShouldScroll(true), 100);

    try {
      // Get conversation history for context (last 10 messages)
      const conversationHistory = messages.slice(-10);
      const response = await getAIBotResponse(currentInput, conversationHistory);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Trigger scroll after bot response is added
      setTimeout(() => setShouldScroll(true), 200);

    } catch (error) {
      console.error('Error getting bot response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later, or consult with a healthcare professional for urgent medical concerns.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      // Trigger scroll after error message is added
      setTimeout(() => setShouldScroll(true), 200);

    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();

      // Prevent any default scrolling behavior
      const target = e.target as HTMLElement;
      target.blur();

      handleSendMessage();

      // Refocus after a short delay
      setTimeout(() => {
        target.focus();
      }, 50);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format message text to handle basic markdown-style formatting
  const formatMessageText = (text: string) => {
    // Escape HTML first to prevent XSS
    let formattedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Replace **bold** with <strong> tags (non-greedy)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #1f2937;">$1</strong>');

    // Replace *italic* with <em> tags (but not if it's part of **)
    formattedText = formattedText.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em style="font-style: italic;">$1</em>');

    // Replace line breaks with proper spacing
    formattedText = formattedText.replace(/\n\n/g, '<br><br>');
    formattedText = formattedText.replace(/\n/g, '<br>');

    // Clean up any remaining asterisks that weren't part of formatting
    formattedText = formattedText.replace(/\*+/g, '');

    return formattedText;
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
                <div
                  className="whitespace-pre-wrap max-w-none"
                  style={{
                    lineHeight: '1.6',
                    fontSize: '14px',
                  }}
                  dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
                />
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
          style={{
            scrollBehavior: 'auto',
            overflowY: 'hidden'
          }}
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