import useSWRMutation from "swr/mutation";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMessageDto, SendMessageResponse } from "@/types/message.interface";

/**
 * Fetcher function for sending a message
 */
const sendMessageFetcher = async (
	url: string,
	{ arg }: { arg: { data: CreateMessageDto; token?: string | null } }
): Promise<SendMessageResponse> => {
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
		const error = new Error("Failed to send message") as Error & {
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
 * A hook to send a message to an existing thread
 * Uses SWR mutation for optimistic updates and automatic revalidation
 */
export function useSendMessage() {
	const { token } = useAuth();

	const { trigger, isMutating, error, data } = useSWRMutation<
		SendMessageResponse,
		Error,
		string,
		{ data: CreateMessageDto; token?: string | null }
	>("/message/messages", sendMessageFetcher);

	const sendMessage = async (messageData: CreateMessageDto) => {
		return trigger({ data: messageData, token: token ?? undefined });
	};

	return {
		sendMessage,
		isLoading: isMutating,
		error,
		data,
	};
}
