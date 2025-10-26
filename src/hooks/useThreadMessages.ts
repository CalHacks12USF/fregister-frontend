import useSWR from "swr";
import { apiFetcher } from "@/utils/apiFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { ThreadMessagesResponse } from "@/types/message.interface";

/**
 * A hook to fetch all messages in a thread
 * Uses SWR for automatic caching and revalidation
 */
export function useThreadMessages(threadId: string | null, shouldFetch: boolean = true) {
	const { token } = useAuth();

	const key = shouldFetch && threadId && token ? [`/message/threads/${threadId}/messages`, token] : null;

	const { data, error, isLoading, mutate } = useSWR<ThreadMessagesResponse>(key, apiFetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	return {
		messages: data?.data || [],
		total: data?.total || 0,
		isLoading,
		error,
		mutate,
	};
}
