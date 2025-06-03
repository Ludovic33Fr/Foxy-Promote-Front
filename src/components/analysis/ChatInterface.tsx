import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import Button from '../ui/Button';
import { ChatMessage } from '../../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isAiTyping?: boolean;
}

const ChatInterface = ({
  messages,
  onSendMessage,
  isAiTyping = false,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">AI Coach Chat</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions about your track or get personalized advice
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <div>
              <Bot className="h-12 w-12 mx-auto mb-3 text-primary/40" />
              <p className="text-sm">
                No messages yet. Start a conversation with your AI coach.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-muted text-foreground rounded-tl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'user' ? (
                    <div className="flex items-center">
                      <span className="text-xs opacity-80">You</span>
                      <User className="h-3 w-3 ml-1 opacity-80" />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Bot className="h-3 w-3 mr-1 opacity-80" />
                      <span className="text-xs opacity-80">AI Coach</span>
                    </div>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-foreground rounded-tl-none">
              <div className="flex items-center mb-1">
                <Bot className="h-3 w-3 mr-1 opacity-80" />
                <span className="text-xs opacity-80">AI Coach</span>
              </div>
              <div className="flex space-x-1 py-2">
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
          />
          <Button type="submit" disabled={!inputValue.trim() || isAiTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;