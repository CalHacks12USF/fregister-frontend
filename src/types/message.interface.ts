import { Thread } from "./thread.interface";

export interface CreateThreadDto {
	user_id: string;
	content: string;
}

export interface Message {
	id: string;
	thread_id: string;
	role: "user" | "assistant" | "system";
	content: string;
	user_id: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
	updated_at: string;
}

export interface StartConversationResponse {
	success: true;
	data: {
		thread: Thread;
		content: string;
	};
}

export interface CreateMessageDto {
	thread_id: string;
	user_id: string;
	content: string;
	role?: "user" | "assistant" | "system";
	metadata?: Record<string, unknown>;
}

export interface SendMessageResponse {
	success: true;
	data: {
		userMessage: Message;
		aiMessage: Message;
	};
}

export interface ThreadMessagesResponse {
	success: true;
	data: Message[];
	total: number;
	limit: number;
	offset: number;
}
