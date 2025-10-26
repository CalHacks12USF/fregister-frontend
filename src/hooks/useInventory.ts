import useSWR from "swr";
import { apiFetcher } from "@/utils/apiFetcher";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryResponse } from "@/types/inventory.interface";

/**
 * A hook to fetch the latest inventory data from the backend
 * This hook fetches fresh inventory data from the `/inventory/latest` endpoint whenever a token is available
 */
export function useInventory() {
	const { token } = useAuth();

	const key = token ? [`/inventory/latest`, token] : null;
	const { data, error, isLoading, mutate } = useSWR<InventoryResponse>(key, apiFetcher, {
		revalidateOnFocus: false, // Don't refetch on window focus
		revalidateOnReconnect: true, // Refetch on reconnect
	});

	return {
		inventory: data,
		error,
		isLoading,
		mutate, // Exposing mutate for re-fetching or updating inventory data locally
	};
}
