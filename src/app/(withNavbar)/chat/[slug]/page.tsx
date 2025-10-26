'use client';

import { useState, useEffect, useRef, use } from 'react';
import InputField from '@/components/InputField';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useThreadMessages } from '@/hooks/useThreadMessages';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  user: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isTyping?: boolean;
  fullText?: string;
}

interface Thread {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ConversationData {
  thread: Thread;
  content: string;
}

export default function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { sendMessage: sendMessageToBackend, isLoading: isSending } = useSendMessage();
  const hasProcessedInitial = useRef(false);
  const [generatingText, setGeneratingText] = useState('');
  const [isNewThread, setIsNewThread] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Initialize messages as empty to avoid hydration mismatch
  const [messages, setMessages] = useState<Message[]>([]);

  // Check sessionStorage on client-side only (after hydration)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const conversationData = sessionStorage.getItem(`chat-${slug}-data`);
      if (conversationData) {
        try {
          const data: ConversationData = JSON.parse(conversationData);
          sessionStorage.removeItem(`chat-${slug}-data`);

          setIsNewThread(true);
          setInitialContent(data.content);

          // Show the initial user message optimistically for new threads
          setMessages([{
            id: `temp-user-initial`,
            text: data.content,
            user: 'user' as const,
            timestamp: new Date(),
          }]);
        } catch (error) {
          console.error('Failed to parse conversation data:', error);
        }
      }
      setHasCheckedStorage(true);
    }
  }, [slug]);

  // Fetch messages for existing threads (only if NOT a new thread AND we've checked storage)
  const { messages: fetchedMessages, isLoading: isLoadingMessages } = useThreadMessages(
    slug,
    hasCheckedStorage && !isNewThread
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages for non-new threads
  useEffect(() => {
    if (!isNewThread && fetchedMessages.length > 0 && messages.length === 0) {
      // Convert backend messages to frontend format
      const convertedMessages: Message[] = fetchedMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        user: msg.role,
        timestamp: new Date(msg.created_at),
      }));
      setMessages(convertedMessages);
    }
  }, [fetchedMessages, isNewThread, messages.length]);

  // Typewriter effect for "Generating response" text
  useEffect(() => {
    const thinkingMessage = messages.find(m => m.id === 'ai-thinking');
    if (!thinkingMessage) {
      setGeneratingText('');
      return;
    }

    const fullText = 'Generating response';
    if (generatingText.length < fullText.length) {
      const timer = setTimeout(() => {
        setGeneratingText(fullText.slice(0, generatingText.length + 1));
      }, 20); // Typing speed in ms per character
      return () => clearTimeout(timer);
    }
  }, [messages, generatingText]);

  // Typewriter effect for AI messages
  useEffect(() => {
    const typingMessage = messages.find(m => m.isTyping && m.fullText);
    if (!typingMessage) return;

    const fullText = typingMessage.fullText!;
    const currentLength = typingMessage.text.length;

    if (currentLength < fullText.length) {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map(m =>
          m.id === typingMessage.id
            ? { ...m, text: fullText.slice(0, currentLength + 1) }
            : m
        ));
      }, 20); // Typing speed in ms per character

      return () => clearTimeout(timer);
    } else {
      // Typing complete, remove typing flag
      setMessages(prev => prev.map(m =>
        m.id === typingMessage.id
          ? { ...m, isTyping: false, fullText: undefined }
          : m
      ));
    }
  }, [messages]);

  // Send initial message if coming from new thread creation
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (initialContent && user?.id && !hasProcessedInitial.current) {
        hasProcessedInitial.current = true;

        // Add AI generating indicator
        const thinkingMessage: Message = {
          id: 'ai-thinking',
          text: 'Generating response',
          user: 'system',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, thinkingMessage]);

        try {
          // Send user message to backend
          const result = await sendMessageToBackend({
            thread_id: slug,
            user_id: user.id,
            content: initialContent,
            role: 'user',
          });

          if (result?.success) {
            // Remove thinking indicator and temp message, add real messages with typewriter effect
            setMessages(prev => {
              const filtered = prev.filter(m => m.id !== 'ai-thinking' && m.id !== 'temp-user-initial');
              return [
                ...filtered,
                {
                  id: result.data.userMessage.id,
                  text: result.data.userMessage.content,
                  user: result.data.userMessage.role,
                  timestamp: new Date(result.data.userMessage.created_at),
                },
                {
                  id: result.data.aiMessage.id,
                  text: '',
                  fullText: result.data.aiMessage.content,
                  isTyping: true,
                  user: result.data.aiMessage.role,
                  timestamp: new Date(result.data.aiMessage.created_at),
                },
              ];
            });
          } else {
            // Remove thinking indicator on error
            setMessages(prev => prev.filter(m => m.id !== 'ai-thinking'));
            toast.error('Failed to get AI response');
          }
        } catch (error) {
          console.error('Error sending initial message:', error);
          // Remove thinking indicator on error
          setMessages(prev => prev.filter(m => m.id !== 'ai-thinking'));
          toast.error('Failed to get AI response');
        }
      }
    };

    sendInitialMessage();
  }, [initialContent, user, slug, sendMessageToBackend]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    const messageContent = inputValue;
    setInputValue('');

    // Add user message to the UI immediately
    const userMessage: Message = {
      id: `temp-user-${Date.now()}`,
      text: messageContent,
      user: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Add AI generating indicator
    const thinkingMessage: Message = {
      id: 'ai-thinking',
      text: 'Generating response',
      user: 'system',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // Send user message to backend
      const result = await sendMessageToBackend({
        thread_id: slug,
        user_id: user.id,
        content: messageContent,
        role: 'user',
      });

      if (result?.success) {
        // Remove thinking indicator and add both user message and AI response with typewriter effect
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== 'ai-thinking' && m.id !== userMessage.id);
          return [
            ...filtered,
            {
              id: result.data.userMessage.id,
              text: result.data.userMessage.content,
              user: result.data.userMessage.role,
              timestamp: new Date(result.data.userMessage.created_at),
            },
            {
              id: result.data.aiMessage.id,
              text: '',
              fullText: result.data.aiMessage.content,
              isTyping: true,
              user: result.data.aiMessage.role,
              timestamp: new Date(result.data.aiMessage.created_at),
            },
          ];
        });
      } else {
        // Remove thinking indicator on error
        setMessages(prev => prev.filter(m => m.id !== 'ai-thinking'));
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove thinking indicator on error
      setMessages(prev => prev.filter(m => m.id !== 'ai-thinking'));
      toast.error('Failed to send message');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="flex flex-col h-screen w-[55%] mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {(!hasCheckedStorage || isLoadingMessages) && !isNewThread && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-custom-gray text-sm">Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-6 py-3 ${
                    message.user === 'user'
                      ? 'bg-primary/80 text-white shadow-md max-w-[70%]'
                      : 'text-dark'
                  }`}
                >
                  <p className="text-sm">
                    {message.user === 'system' ? generatingText : message.text}
                    {message.user === 'system' && generatingText === 'Generating response' && (
                      <span className="inline-flex ml-1 items-end">
                        <span
                          className="text-lg font-bold text-primary"
                          style={{
                            animation: 'float 1.4s ease-in-out 0s infinite',
                          }}
                        >.</span>
                        <span
                          className="text-lg font-bold text-primary"
                          style={{
                            animation: 'float 1.4s ease-in-out 0.2s infinite',
                          }}
                        >.</span>
                        <span
                          className="text-lg font-bold text-primary"
                          style={{
                            animation: 'float 1.4s ease-in-out 0.4s infinite',
                          }}
                        >.</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : null}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="flex flex-col justify-center w-full">
        <form onSubmit={handleSendMessage} className="w-full">
          <InputField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 mx-auto"
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
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
