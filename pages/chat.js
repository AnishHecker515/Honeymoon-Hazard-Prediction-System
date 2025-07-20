import { useState } from 'react';
import Layout from '../components/Layout';
import { MessageCircle, Send, Bot, User, AlertTriangle, Settings, Trash2 } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello, I'm here to provide a safe, anonymous space to discuss relationship concerns. Everything you share here is completely private and confidential. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [error, setError] = useState('');

  // Pre-defined response patterns for safety assessment
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for immediate danger keywords
    if (message.includes('hurt') || message.includes('violence') || message.includes('afraid') || 
        message.includes('threat') || message.includes('hit') || message.includes('abuse')) {
      return {
        content: "I'm very concerned about what you're sharing. Your safety is the most important thing right now. If you're in immediate danger, please call 911 or your local emergency services. You can also contact the National Domestic Violence Hotline at 1-800-799-7233 (available 24/7). They have trained counselors who can help you create a safety plan. Would you like me to provide some immediate safety resources?",
        urgent: true
      };
    }
    
    // Control behaviors
    if (message.includes('control') || message.includes('phone') || message.includes('money') || 
        message.includes('friends') || message.includes('family') || message.includes('isolat')) {
      return {
        content: "What you're describing sounds like controlling behavior, which can be a serious warning sign in relationships. Healthy relationships are built on mutual respect and trust, not control. Partners should support your connections with friends and family, not limit them. Have you noticed these controlling behaviors getting worse over time? It might be helpful to talk to a trusted friend, family member, or counselor about what you're experiencing.",
        urgent: false
      };
    }
    
    // Travel-specific concerns
    if (message.includes('trip') || message.includes('travel') || message.includes('honeymoon') || 
        message.includes('vacation') || message.includes('destination')) {
      return {
        content: "It's important that you feel completely comfortable and safe about any travel plans. In healthy relationships, both partners should be involved in planning and have access to all travel information. Red flags include: secretive planning, discouraging you from telling others about the trip, controlling access to travel documents or money, or choosing very isolated locations against your wishes. What specific concerns do you have about your upcoming travel?",
        urgent: false
      };
    }
    
    // General relationship concerns
    if (message.includes('relationship') || message.includes('partner') || message.includes('boyfriend') || 
        message.includes('girlfriend') || message.includes('husband') || message.includes('wife')) {
      return {
        content: "Thank you for sharing your concerns. Healthy relationships should make you feel supported, respected, and safe. Warning signs to watch for include: attempts to isolate you from others, controlling your activities or finances, extreme jealousy, verbal or emotional abuse, and any form of physical intimidation. Trust your instincts - if something feels wrong, it's worth exploring those feelings. What specific behaviors or situations are concerning you?",
        urgent: false
      };
    }
    
    // Help-seeking
    if (message.includes('help') || message.includes('what should i do') || message.includes('advice')) {
      return {
        content: "I'm glad you're reaching out for support - that takes courage. Here are some steps you can consider: 1) Trust your instincts about your situation, 2) Talk to trusted friends or family members, 3) Contact a domestic violence hotline for professional guidance (1-800-799-7233), 4) Consider speaking with a counselor or therapist, 5) Create a safety plan if you feel you might be in danger. Remember, you deserve to be in a relationship that feels safe and supportive. What feels like the most important next step for you right now?",
        urgent: false
      };
    }
    
    // Default supportive response
    return {
      content: "I hear you, and I want you to know that your feelings and concerns are valid. It's important to trust your instincts about your relationships and safety. If you're comfortable sharing more details about what's concerning you, I can try to provide more specific guidance. Remember, healthy relationships should make you feel safe, respected, and supported. Is there a particular situation or behavior that's been troubling you?",
      urgent: false
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Check if we have an API key for real OpenAI integration
      if (apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a compassionate AI assistant specializing in relationship safety and domestic violence awareness. Provide supportive, non-judgmental responses while prioritizing user safety. Always encourage professional help for serious situations and provide crisis resources when appropriate. Keep responses empathetic and focused on safety.'
              },
              ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              {
                role: 'user',
                content: inputMessage
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        const aiResponse = {
          id: messages.length + 2,
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Use pre-defined responses when no API key
        setTimeout(() => {
          const response = getAIResponse(inputMessage);
          const aiResponse = {
            id: messages.length + 2,
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
            urgent: response.urgent
          };

          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }
    } catch (error) {
      setError('Failed to get response. Please try again.');
      console.error('AI response error:', error);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: "Hello, I'm here to provide a safe, anonymous space to discuss relationship concerns. Everything you share here is completely private and confidential. How can I help you today?",
        timestamp: new Date()
      }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-purple-100 rounded-full">
                <MessageCircle className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Anonymous Safety Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Confidential AI-powered support for relationship concerns and safety questions
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🔒 Your Privacy is Protected
                </h3>
                <p className="text-green-800">
                  This conversation is completely anonymous and private. No personal information 
                  is stored or tracked. You can speak freely about your concerns in a safe space.
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-xl mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Chat Settings</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="API Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {showApiKeyInput && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key (Optional - for enhanced AI responses)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your API key is only used for this session and is never stored. 
                    Without an API key, you&rsquo;ll receive only pre-programmed safety responses.
                  </p>
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Bot className="w-5 h-5 text-purple-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : message.urgent
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="p-2 bg-gray-100 rounded-full">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl max-w-xs lg:max-w-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex space-x-4">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your concerns... (Press Enter to send)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows="2"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  In Crisis? Get Immediate Help
                </h3>
                <div className="space-y-2 text-red-800">
                  <p><strong>Emergency:</strong> <a href="tel:911" className="underline">Call 911</a></p>
                  <p><strong>Domestic Violence Hotline:</strong> <a href="tel:1-800-799-7233" className="underline">1-800-799-7233</a></p>
                  <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                  <p><strong>Sexual Assault Hotline:</strong> <a href="tel:1-800-656-4673" className="underline">1-800-656-4673</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}