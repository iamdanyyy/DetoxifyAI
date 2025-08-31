interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    if (!this.apiKey) {
      // Fallback to a simple response if no API key
      return this.getFallbackResponse(message);
    }

    try {
      const messages: ChatMessage[] = [
        {
          role: 'assistant',
          content: `You are DetoxifyAI, a compassionate AI companion for addiction recovery and detox support. You provide:
- Encouraging and supportive responses
- Evidence-based recovery advice
- Crisis intervention guidance when needed
- Motivational support for sobriety
- Help with coping strategies

Always be empathetic, non-judgmental, and supportive. If someone is in crisis, encourage them to seek professional help immediately.`
        },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now.';
    } catch (error) {
      console.error('AI API error:', error);
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('craving') || lowerMessage.includes('urge')) {
      return "I understand you're experiencing cravings right now. This is completely normal in recovery. Try taking deep breaths, drinking water, or calling a supportive friend. Remember, cravings typically pass within 15-20 minutes. You're stronger than this moment.";
    }
    
    if (lowerMessage.includes('relapse') || lowerMessage.includes('slipped')) {
      return "Recovery isn't a straight line, and setbacks can happen. What matters most is that you're here now, reaching out for support. This doesn't erase your progress. Let's focus on what you can do right now to get back on track.";
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('tired')) {
      return "I hear you, and your feelings are valid. Recovery can be exhausting, but you've already shown incredible strength by starting this journey. Every day you choose recovery, you're building a better future for yourself. You're not alone in this.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "You're taking a brave step by asking for help. Remember, you don't have to go through this alone. Consider reaching out to a counselor, support group, or trusted friend. Your recovery matters, and there are people who want to support you.";
    }
    
    return "Thank you for sharing with me. I'm here to support you on your recovery journey. Remember that every step forward, no matter how small, is progress. You're doing important work, and I believe in your strength.";
  }
}

export const aiService = new AIService();

