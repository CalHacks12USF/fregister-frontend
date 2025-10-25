'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import { useMessageMutation } from '@/hooks/useMessageMutation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const { startConversation, isLoading } = useMessageMutation();

  const startChat = async () => {
    if (!inputValue.trim()) return;
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    const toastId = toast.loading('Starting conversation...');

    try {
      const result = await startConversation({
        user_id: user.id,
        content: inputValue,
        role: 'user',
      });

      if (result?.success) {
        toast.success('Conversation started!', { id: toastId });
        const threadId = result.data.thread.id;

        // Redirect to the chat page with the new thread ID
        router.push(`/chat/${threadId}`);
      } else {
        toast.error('Failed to start conversation', { id: toastId });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation', { id: toastId });
    }
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
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}