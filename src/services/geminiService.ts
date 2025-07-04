import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('Gemini API key not configured');
        return;
      }
      
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Updated to use the correct model name
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
    }
  }

  private checkAPIAvailability(): boolean {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API not properly configured. Please check your API key.');
    }
    return true;
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      this.checkAPIAvailability();

      // Build conversation context
      const context = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const prompt = context 
        ? `Previous conversation:\n${context}\n\nUser: ${message}\n\nAssistant:`
        : `User: ${message}\n\nAssistant:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid API key. Please check your Gemini API configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else if (error.message.includes('not found') || error.message.includes('not supported')) {
          throw new Error('Model not available. Please try again later.');
        }
      }
      
      throw new Error('Failed to get response from Gemini AI. Please try again.');
    }
  }

  async generateVideoTitle(description: string): Promise<string> {
    try {
      this.checkAPIAvailability();
      
      const prompt = `Generate a compelling YouTube video title for this content: "${description}". Make it engaging, SEO-friendly, and under 60 characters. Return only the title without quotes.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().replace(/"/g, '').trim();
    } catch (error) {
      console.error('Error generating video title:', error);
      return description.length > 60 ? description.substring(0, 57) + '...' : description;
    }
  }

  async generateVideoDescription(title: string, content: string): Promise<string> {
    try {
      this.checkAPIAvailability();
      
      const prompt = `Create a YouTube video description for a video titled "${title}" with this content: "${content}". Include relevant hashtags and make it engaging. Keep it under 1000 characters.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating video description:', error);
      return `${content}\n\n#video #content #youtube #education`;
    }
  }

  async generateVideoTags(title: string, description: string): Promise<string[]> {
    try {
      this.checkAPIAvailability();
      
      const prompt = `Generate 10 relevant YouTube tags for a video titled "${title}" with description: "${description}". Return only the tags separated by commas, no hashtags or extra text.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text()
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0 && tag.length < 30)
        .slice(0, 10);
    } catch (error) {
      console.error('Error generating video tags:', error);
      return ['video', 'content', 'youtube', 'education', 'tutorial'];
    }
  }
}

export const geminiService = new GeminiService();
export type { ChatMessage };