import useSWR from "swr";
import { apiFetcher } from "@/utils/apiFetcher";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { User } from "@/types";

/**
 * A hook to fetch the profile of the currently authenticated user from the backend
 * This hook fetches fresh user data from the `/auth/me` endpoint whenever a token is available
 */
export function useUser() {
	const { token } = useAuth();

	const key = token ? [`/auth/me`, token] : null;
	const { data, error, isLoading, mutate } = useSWR<User>(key, apiFetcher, {
		revalidateOnFocus: false, // Don't refetch on window focus
		revalidateOnReconnect: true, // Refetch on reconnect
	});

	return {
		user: data,
		error,
		isLoading,
		mutate, // Exposing mutate for re-fetching or updating user data locally
	};
}
