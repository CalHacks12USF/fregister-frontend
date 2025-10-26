import useSWRMutation from "swr/mutation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Fetcher function for starting a conversation
 */
const startConversationFetcher = async (
	url: string,
	{ arg }: { arg: { data: CreateThreadDto; token?: string | null } }
): Promise<StartConversationResponse> => {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (arg.token) {
		headers["Authorization"] = `Bearer ${arg.token}`;
	}

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
		method: "POST",
		headers,
		body: JSON.stringify(arg.data),
	});

	if (!res.ok) {
		const error = new Error("Failed to start conversation") as Error & {
			info?: unknown;
			status?: number;
		};
		try {
			error.info = await res.json();
		} catch {
			error.info = await res.text();
		}
		error.status = res.status;
		throw error;
	}

	return res.json();
};

/**
 * A hook to start a new conversation (creates thread + first message)
 * Uses SWR mutation for optimistic updates and automatic revalidation
 */
export function useMessageMutation() {
	const { token } = useAuth();

	const { trigger, isMutating, error, data } = useSWRMutation<
		StartConversationResponse,
		Error,
		string,
		{ data: CreateThreadDto; token?: string | null }
	>("/message/threads", startConversationFetcher);

	const startConversation = async (messageData: CreateThreadDto) => {
		return trigger({ data: messageData, token: token ?? undefined });
	};

	return {
		startConversation,
		isLoading: isMutating,
		error,
		data,
	};
}
