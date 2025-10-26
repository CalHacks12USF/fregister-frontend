interface CreateThreadDto {
	user_id: string;
	content: string;
}

interface Thread {
	id: string;
	title: string;
	user_id: string;
	created_at: string;
	updated_at: string;
}

interface Message {
	id: string;
	thread_id: string;
	role: "user" | "assistant" | "system";
	content: string;
	user_id: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
	updated_at: string;
}

interface StartConversationResponse {
	success: true;
	data: {
		thread: Thread;
		content: string;
	};
}
