export interface Thread {
	id: string;
	title: string;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export interface ThreadsResponse {
	success: boolean;
	data: Thread[];
	total: number;
	limit: number;
	offset: number;
}
