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
    
    // Crisis and emergency detection - highest priority
    if (this.detectCrisisPattern(lowerMessage)) {
      return this.getCrisisResponse(lowerMessage);
    }
    
    // Cravings and urges
    if (this.detectCravingPattern(lowerMessage)) {
      return this.getCravingResponse(lowerMessage);
    }
    
    // Relapse and setbacks
    if (this.detectRelapsePattern(lowerMessage)) {
      return this.getRelapseResponse(lowerMessage);
    }
    
    // Addiction-specific patterns
    if (this.detectAddictionTypePattern(lowerMessage)) {
      return this.getAddictionSpecificResponse(lowerMessage);
    }
    
    // Emotions and feelings
    if (this.detectEmotionalPattern(lowerMessage)) {
      return this.getEmotionalResponse(lowerMessage);
    }
    
    // Motivation and progress
    if (this.detectMotivationPattern(lowerMessage)) {
      return this.getMotivationalResponse(lowerMessage);
    }
    
    // Milestones and achievements
    if (this.detectMilestonePattern(lowerMessage)) {
      return this.getMilestoneResponse(lowerMessage);
    }
    
    // Coping strategies
    if (this.detectCopingPattern(lowerMessage)) {
      return this.getCopingResponse(lowerMessage);
    }
    
    // Help and support requests
    if (this.detectHelpPattern(lowerMessage)) {
      return this.getHelpResponse(lowerMessage);
    }
    
    // Time-related patterns (day counts, anniversaries)
    if (this.detectTimePattern(lowerMessage)) {
      return this.getTimeResponse(lowerMessage);
    }
    
    // Greetings and casual conversation
    if (this.detectGreetingPattern(lowerMessage)) {
      return this.getGreetingResponse(lowerMessage);
    }
    
    // Default supportive response
    return this.getDefaultResponse();
  }
  
  private detectCrisisPattern(message: string): boolean {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'can\'t go on', 'want to die',
      'self harm', 'hurt myself', 'overdose', 'emergency', 'crisis',
      'can\'t take it', 'hopeless', 'give up', 'no point'
    ];
    return crisisKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectCravingPattern(message: string): boolean {
    const cravingKeywords = [
      'craving', 'urge', 'tempted', 'want to drink', 'want to use',
      'feeling triggered', 'trigger', 'struggling with urges',
      'can\'t stop thinking about', 'really want', 'need a drink',
      'need to use', 'withdrawal', 'shaking', 'sweating'
    ];
    return cravingKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectRelapsePattern(message: string): boolean {
    const relapseKeywords = [
      'relapse', 'slipped', 'used again', 'drank again', 'fell off',
      'broke my sobriety', 'messed up', 'failed', 'disappointed',
      'back to square one', 'reset', 'starting over'
    ];
    return relapseKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectAddictionTypePattern(message: string): boolean {
    const addictionKeywords = [
      'alcohol', 'drinking', 'beer', 'wine', 'vodka', 'whiskey',
      'porn', 'pornography', 'masturbation', 'sexual addiction',
      'food', 'eating', 'binge eating', 'overeating', 'food addiction',
      'drugs', 'cocaine', 'heroin', 'marijuana', 'pills', 'opioids'
    ];
    return addictionKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectEmotionalPattern(message: string): boolean {
    const emotionalKeywords = [
      'depressed', 'sad', 'angry', 'anxious', 'lonely', 'frustrated',
      'overwhelmed', 'stressed', 'scared', 'worried', 'upset',
      'feeling down', 'low mood', 'emotional', 'crying', 'tears'
    ];
    return emotionalKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectMotivationPattern(message: string): boolean {
    const motivationKeywords = [
      'motivation', 'motivated', 'tired', 'exhausted', 'give up',
      'why bother', 'no energy', 'burned out', 'discouraged',
      'losing hope', 'hard to continue', 'questioning'
    ];
    return motivationKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectMilestonePattern(message: string): boolean {
    const milestoneKeywords = [
      'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years',
      'sober', 'clean', 'milestone', 'anniversary', 'achievement',
      '30 days', '90 days', '1 year', 'celebrate', 'proud'
    ];
    const timeNumbers = /\d+\s*(day|week|month|year)s?/;
    return milestoneKeywords.some(keyword => message.includes(keyword)) || timeNumbers.test(message);
  }
  
  private detectCopingPattern(message: string): boolean {
    const copingKeywords = [
      'cope', 'coping', 'strategies', 'techniques', 'what should i do',
      'how to deal', 'manage', 'handle', 'get through', 'distraction',
      'activities', 'hobbies', 'exercise', 'meditation', 'breathing'
    ];
    return copingKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectHelpPattern(message: string): boolean {
    const helpKeywords = [
      'help', 'support', 'assistance', 'guidance', 'advice',
      'don\'t know what to do', 'need someone', 'talk to someone',
      'counselor', 'therapist', 'meeting', 'group', 'sponsor'
    ];
    return helpKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectTimePattern(message: string): boolean {
    const timeKeywords = [
      'today', 'yesterday', 'tomorrow', 'this week', 'this month',
      'how long', 'been sober', 'been clean', 'started recovery'
    ];
    return timeKeywords.some(keyword => message.includes(keyword));
  }
  
  private detectGreetingPattern(message: string): boolean {
    const greetingKeywords = [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      'how are you', 'what\'s up', 'greetings', 'howdy'
    ];
    return greetingKeywords.some(keyword => message.includes(keyword));
  }
  
  private getCrisisResponse(message: string): string {
    const crisisResponses = [
      "I'm very concerned about what you're sharing. Your life has value, and there are people who want to help. Please reach out to a crisis hotline immediately: National Suicide Prevention Lifeline: 988 or Crisis Text Line: Text HOME to 741741. You don't have to go through this alone.",
      "What you're feeling right now is temporary, even though it doesn't feel that way. Please contact emergency services (911) or a crisis hotline right away. Your safety is the most important thing right now. Recovery is possible, and you deserve support.",
      "I hear that you're in tremendous pain right now. Please don't hurt yourself. Call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. There are people trained to help you through this crisis. You matter, and this feeling will pass."
    ];
    return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
  }
  
  private getCravingResponse(message: string): string {
    const cravingResponses = [
      "I understand you're experiencing strong cravings right now. This is completely normal in recovery. Try the HALT check: Are you Hungry, Angry, Lonely, or Tired? Address these needs first. Remember, cravings typically pass within 15-20 minutes. You can surf this wave.",
      "Cravings are like waves - they build up, peak, and then crash down. You're stronger than this moment. Try deep breathing: 4 counts in, hold for 4, out for 4. Call a supportive friend, take a cold shower, or go for a walk. This feeling will pass.",
      "Right now, your brain is trying to convince you that you need your substance, but that's the addiction talking, not the real you. Try grounding techniques: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. You've got this.",
      "I know these urges feel overwhelming, but you've overcome them before and you can do it again. Try changing your environment - go outside, call someone, or engage in a physical activity. Remember why you started this journey. One moment at a time."
    ];
    return cravingResponses[Math.floor(Math.random() * cravingResponses.length)];
  }
  
  private getRelapseResponse(message: string): string {
    const relapseResponses = [
      "Recovery isn't a straight line, and setbacks don't erase your progress. What matters most is that you're here now, reaching out. Every day of sobriety you've had still counts. Let's focus on what you can do right now to get back on track. You haven't failed - you're human.",
      "I hear the disappointment in your message, but please don't let shame keep you stuck. A slip doesn't mean you're back to square one. You've learned tools and built strength that are still with you. Reach out to your support system and consider this a learning opportunity. Recovery is a process.",
      "This doesn't define you or your recovery journey. Many people in long-term recovery have experienced setbacks. The most important thing is to be gentle with yourself and get back to your recovery practices as soon as possible. Consider talking to a counselor or attending a meeting today.",
      "Relapse can be part of the recovery process for many people. What you're feeling right now - the guilt, disappointment - is normal, but don't let it keep you from getting back on track. Focus on today and the next right choice. Your recovery is worth fighting for."
    ];
    return relapseResponses[Math.floor(Math.random() * relapseResponses.length)];
  }
  
  private getAddictionSpecificResponse(message: string): string {
    if (message.includes('alcohol') || message.includes('drinking')) {
      return "Alcohol addiction affects millions of people. Remember that alcohol is a depressant that can worsen anxiety and depression. Focus on staying hydrated, eating nutritious meals, and avoiding triggers like bars or drinking buddies. Consider joining AA or SMART Recovery for peer support.";
    }
    if (message.includes('porn') || message.includes('masturbation')) {
      return "Sexual addiction and compulsive behaviors can create shame cycles that are hard to break. Consider using website blockers, finding accountability partners, and exploring the underlying emotions that trigger these behaviors. Remember, recovery is about progress, not perfection.";
    }
    if (message.includes('food') || message.includes('eating')) {
      return "Food addiction and eating disorders are complex because we need food to survive. Focus on intuitive eating, removing trigger foods from your environment, and addressing emotional eating patterns. Consider working with a nutritionist who understands eating disorders.";
    }
    return "Addiction affects the brain's reward system, but recovery is absolutely possible. Focus on building healthy habits, identifying your triggers, and creating a strong support network. Every addiction has unique challenges, but the principles of recovery remain similar.";
  }
  
  private getEmotionalResponse(message: string): string {
    const emotionalResponses = [
      "I hear that you're struggling emotionally right now. These feelings are valid and temporary. Recovery often brings up emotions that were numbed by substances or behaviors. This is actually a sign of healing, even though it's uncomfortable. Be patient and gentle with yourself.",
      "Emotional ups and downs are a normal part of recovery. Your brain is learning to process feelings without your substance or behavior. Try journaling, talking to a friend, or practicing mindfulness. These feelings will pass, and you're building emotional resilience.",
      "It's okay to feel what you're feeling. Recovery isn't just about stopping a behavior - it's about learning to navigate life and emotions in a healthy way. Consider reaching out to a counselor or therapist who specializes in addiction. You don't have to carry these feelings alone.",
      "Your emotions are information, not instructions. Just because you feel sad, angry, or anxious doesn't mean you need to act on those feelings with your addictive behavior. Try naming the emotion, feeling it fully, and then letting it pass naturally."
    ];
    return emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)];
  }
  
  private getMotivationalResponse(message: string): string {
    const motivationalResponses = [
      "I hear that you're feeling drained, and that's completely understandable. Recovery takes enormous courage and energy. But look how far you've come - you're here, you're trying, and that matters more than you know. Rest when you need to, but don't give up on yourself.",
      "Recovery fatigue is real. Some days will feel harder than others, and that's normal. Remember your 'why' - the reasons you started this journey. Write them down if you haven't already. You're building a life worth living, one day at a time.",
      "Every single day you choose recovery, you're rewiring your brain and building strength. Even on the hardest days, you're making progress. It's okay to feel tired - you're doing some of the hardest work a person can do. Be proud of your efforts.",
      "Motivation comes and goes, but commitment carries you through the tough days. You don't have to feel motivated to take the next right action. Focus on just today, just this hour if needed. You're stronger than you realize."
    ];
    return motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)];
  }
  
  private getMilestoneResponse(message: string): string {
    const milestoneResponses = [
      "Congratulations on your progress! Every milestone deserves recognition, whether it's one day or one year. You're proving to yourself that recovery is possible. Take a moment to acknowledge how far you've come and celebrate this achievement.",
      "This is amazing! Each day, week, and month of recovery is a victory worth celebrating. You're not just counting time - you're building a new life. Be proud of yourself and use this milestone as motivation to keep going.",
      "What an incredible achievement! Recovery milestones are earned through daily choices, courage, and commitment. You should be proud of the work you've put in. Consider sharing this milestone with someone who supports your recovery.",
      "Milestones remind us that recovery is possible and that we can change our lives. You've proven that you can overcome challenges and build new habits. This achievement belongs to you - you've earned every single day."
    ];
    return milestoneResponses[Math.floor(Math.random() * milestoneResponses.length)];
  }
  
  private getCopingResponse(message: string): string {
    const copingResponses = [
      "Great coping strategies include: deep breathing exercises, going for walks, calling a supportive friend, journaling, listening to music, taking a shower, doing puzzles, or engaging in hobbies. The key is having multiple tools ready before you need them.",
      "When facing difficult moments, try the STOP technique: Stop what you're doing, Take a breath, Observe your thoughts and feelings, and Proceed mindfully. Other helpful strategies include exercise, meditation, creative activities, or volunteering to help others.",
      "Building a coping toolkit is essential for recovery. Physical activities like exercise or yoga, mental activities like reading or puzzles, social activities like calling friends or attending meetings, and spiritual practices like meditation or prayer can all help.",
      "Healthy coping starts with self-care basics: adequate sleep, nutritious food, regular exercise, and social connection. When stress hits, try progressive muscle relaxation, mindfulness meditation, or engaging in activities that bring you joy and purpose."
    ];
    return copingResponses[Math.floor(Math.random() * copingResponses.length)];
  }
  
  private getHelpResponse(message: string): string {
    const helpResponses = [
      "Asking for help is a sign of strength, not weakness. Consider reaching out to a addiction counselor, therapist, support group (AA, NA, SMART Recovery), or trusted friend/family member. You don't have to navigate recovery alone - support makes the journey easier.",
      "There are many resources available to support your recovery: therapy, support groups, online communities, crisis hotlines, and recovery apps. Professional help can provide tools and strategies tailored to your specific needs. You deserve support.",
      "Recovery communities exist because connection and support are vital to healing. Consider attending a meeting (in-person or online), finding a sponsor or accountability partner, or working with a therapist who specializes in addiction. Help is available.",
      "Your willingness to seek help shows incredible self-awareness and courage. Professional counselors, peer support groups, and trusted friends can all play important roles in your recovery. Don't hesitate to reach out - people want to help you succeed."
    ];
    return helpResponses[Math.floor(Math.random() * helpResponses.length)];
  }
  
  private getTimeResponse(message: string): string {
    const timeResponses = [
      "Recovery is measured one day at a time, sometimes one hour or even one minute at a time. Each moment you choose recovery is a victory. Don't focus too much on the numbers - focus on building a life you love living.",
      "Time in recovery is precious, but it's not just about counting days. It's about the quality of life you're building, the relationships you're healing, and the person you're becoming. Every day is an opportunity for growth.",
      "Whether you have one day or many years, you're exactly where you need to be in your recovery journey. Time will pass anyway - choosing to spend it in recovery means choosing to spend it building a better life for yourself.",
      "Recovery time represents so much more than just abstinence - it represents courage, growth, learning, and healing. Each day you choose recovery, you're investing in your future self and the life you want to create."
    ];
    return timeResponses[Math.floor(Math.random() * timeResponses.length)];
  }
  
  private getGreetingResponse(message: string): string {
    const greetingResponses = [
      "Hello! I'm so glad you're here. I'm DetoxifyAI, your recovery companion. I'm here to listen, support, and encourage you on your journey. How are you feeling today?",
      "Hi there! It's wonderful to connect with you. I'm here to provide support, encouragement, and guidance as you navigate your recovery journey. What's on your mind today?",
      "Hello! Thank you for reaching out. I'm DetoxifyAI, and I'm here to support you in your recovery. Every conversation is a step forward. How can I help you today?",
      "Hi! I'm happy you're here and that you're choosing to engage in your recovery today. That's something to be proud of. What would you like to talk about?"
    ];
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
  }
  
  private getDefaultResponse(): string {
    const defaultResponses = [
      "Thank you for sharing with me. I'm here to support you on your recovery journey. Remember that every step forward, no matter how small, is progress. You're doing important work, and I believe in your strength.",
      "I appreciate you taking the time to connect. Recovery is a journey with ups and downs, and having someone to talk to makes a difference. You're not alone in this process. What would be most helpful to discuss today?",
      "Your recovery matters, and so do you. I'm here to listen without judgment and provide support when you need it. Every day you choose recovery is a day you're choosing yourself and your future.",
      "I'm honored that you're sharing your thoughts with me. Recovery takes courage, and the fact that you're here shows your commitment to building a better life. How can I best support you right now?"
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}

export const aiService = new AIService();

