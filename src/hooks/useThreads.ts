import useSWR from "swr";
import { apiFetcher } from "@/utils/apiFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { ThreadsResponse } from "@/types";

interface UseThreadsParams {
	limit?: number;
	offset?: number;
}

/**
 * A hook to fetch threads from the backend
 * Supports optional filtering by user_id and pagination with limit/offset
 */
export function useThreads(params: UseThreadsParams = {}) {
	const { token, user } = useAuth();
	const { limit = 20, offset = 0 } = params;

	// Build query string
	const queryParams = new URLSearchParams();
	if (user?.id) queryParams.append("user_id", user.id);
	queryParams.append("limit", limit.toString());
	queryParams.append("offset", offset.toString());

	const endpoint = `/message/threads?${queryParams.toString()}`;
	const key = token ? [endpoint, token] : null;

	const { data, error, isLoading, mutate } = useSWR<ThreadsResponse>(key, apiFetcher, {
		revalidateOnFocus: false, // Don't refetch on window focus
		revalidateOnReconnect: true, // Refetch on reconnect
	});

	return {
		threads: data?.data,
		total: data?.total,
		limit: data?.limit,
		offset: data?.offset,
		error,
		isLoading,
		mutate, // For manual revalidation or optimistic updates
	};
}
