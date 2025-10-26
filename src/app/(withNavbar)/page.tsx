'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import { useMessageMutation } from '@/hooks/useMessageMutation';
import { useThreads } from '@/hooks/useThreads';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const { startConversation, isLoading } = useMessageMutation();
  const { mutate: mutateThreads } = useThreads({ limit: 20 });

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
        content: inputValue
      });

      if (result?.success) {
        toast.success('Conversation started!', { id: toastId });
        const threadId = result.data.thread.id;

        // Update the threads cache with the new thread (no API call needed!)
        mutateThreads((currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: [result.data.thread, ...currentData.data],
            total: currentData.total + 1,
          };
        }, false);

        // Store the conversation data in sessionStorage for the chat page
        sessionStorage.setItem(`chat-${threadId}-data`, JSON.stringify(result.data));

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
    <div className="bg-bgMain flex flex-col items-center justify-center h-full px-4">
      <div className="text-primary font-bold text-2xl sm:text-3xl flex flex-col items-center text-center">
        Where should we begin?
        <span className='font-normal text-xs xs:text-sm md:text-base py-2 mb-2 text-custom-gray'>
          Ask me anything about recipes, meal planning, or your inventory
        </span>
      </div>
      <div className='w-full sm:w-5/6 md:w-2/3 mx-auto'>
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