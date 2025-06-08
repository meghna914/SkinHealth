// Chatbot service for communicating with the backend AI chatbot API
import { API_CONFIG } from '../config/api';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  response?: string;
  error?: string;
  timestamp?: string;
}

class ChatbotService {
  private baseUrl: string;

  constructor() {
    // Use the same backend URL as other services
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Send a message to the AI chatbot and get a response
   */
  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          conversation_history: conversationHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: data.success,
        response: data.response,
        error: data.error,
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('Chatbot service error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        response: "I'm sorry, but I'm having trouble connecting to the medical assistant right now. Please try again later, or consult with a healthcare professional for urgent medical concerns."
      };
    }
  }

  /**
   * Check if the chatbot service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Chatbot health check failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;
