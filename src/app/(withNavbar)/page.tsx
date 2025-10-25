'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '@/components/InputField';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const startChat = () => {
    if (!inputValue.trim()) return;

    // Generate a unique chat ID (timestamp-based)
    const chatId = Date.now();

    // Store the initial message in sessionStorage to pass it to the chat page
    sessionStorage.setItem(`chat-${chatId}-initial`, inputValue);

    // Redirect to the new chat
    router.push(`/chat/${chatId}`);
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    startChat();
  };

  return (
    <div className="bg-bgMain flex flex-col items-center justify-center min-h-screen">
      <div className="text-primary font-bold text-3xl flex flex-col items-center">
        Where should we begin?
        <span className='font-normal text-base py-2 mb-2 text-custom-gray'>
          Ask me anything about recipes, meal planning, or your inventory
        </span>
      </div>
      <div className='w-2/3 mx-auto'>
        <form onSubmit={handleStartChat}>
          <InputField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                startChat();
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}