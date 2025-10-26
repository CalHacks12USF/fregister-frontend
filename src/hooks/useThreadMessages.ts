import useSWR from 'swr';
import { apiFetcher } from '@/utils/apiFetcher';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface ThreadMessagesResponse {
  success: true;
  data: Message[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * A hook to fetch all messages in a thread
 * Uses SWR for automatic caching and revalidation
 */
export function useThreadMessages(threadId: string | null, shouldFetch: boolean = true) {
  const { token } = useAuth();

  const key = shouldFetch && threadId && token ? [`/message/threads/${threadId}/messages`, token] : null;

  const { data, error, isLoading, mutate } = useSWR<ThreadMessagesResponse>(
    key,
    apiFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    messages: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}
