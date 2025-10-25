'use client';

import { useState, useEffect, useRef, use } from 'react';
import InputField from '@/components/InputField';

interface Message {
  id: number;
  text: string;
  user: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

const messagesDummy: Message[] = [
  {
    id: 1,
    text: 'What can I make for dinner tonight?',
    user: 'user',
    timestamp: new Date(),
  },
  {
    id: 2,
    text: "Based on what I see, youve got chicken breast, spinach, and cream. How about a creamy garlic chicken with sautéed spinach?",
    user: 'assistant',
    timestamp: new Date(),
  },
  {
    id: 3,
    text: 'Can you check if I still have milk?',
    user: 'user',
    timestamp: new Date(),
  },
  {
    id: 4,
    text: 'You have half a carton left, expiring in two days. Want me to add milk to your next shopping list?',
    user: 'assistant',
    timestamp: new Date(),
  }
];

export default function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoadedInitialRef = useRef(false);

  // Initialize messages from sessionStorage or use dummy data
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const initialMessage = sessionStorage.getItem(`chat-${slug}-initial`);
      if (initialMessage) {
        sessionStorage.removeItem(`chat-${slug}-initial`);
        return [{
          id: Date.now(),
          text: initialMessage,
          user: 'user',
          timestamp: new Date(),
        }];
      }
    }
    return messagesDummy;
  });

  // Simulate AI response for initial message
  useEffect(() => {
    if (!hasLoadedInitialRef.current && messages.length === 1 && messages[0].user === 'user') {
      hasLoadedInitialRef.current = true;
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: 'This is a placeholder AI response. Integration with backend coming soon!',
          user: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      user: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: 'This is a placeholder AI response. Integration with backend coming soon!',
        user: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-[55%] mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-6 py-3 ${
                    message.user === 'user'
                      ? 'bg-primary/80 text-white shadow-md max-w-[70%]'
                      : 'text-dark'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="flex flex-col justify-center w-full">
        <form onSubmit={handleSendMessage} className="w-full">
          <InputField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 mx-auto"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                e.preventDefault();
                const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                handleSendMessage(formEvent as unknown as React.FormEvent);
              }
            }}
          />
        </form>
        <span className='text-custom-gray text-center py-2 text-xs'>
          Fridger can make mistakes, so double-check it.
        </span>
      </div>
    </div>
  );
}
