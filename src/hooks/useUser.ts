import useSWR from 'swr';
import { apiFetcher } from '@/utils/apiFetcher';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { User } from '@/types';

/**
 * A hook to fetch the profile of the currently authenticated user
 */
export function useUser() {
  const { user, token } = useAuth();

  const key = user?.uid && token ? [`/users/${user.uid}`, token] : null;
  const { data, error, isLoading, mutate } = useSWR<User>(key, apiFetcher);
  return {
    user: data,
    error,
    isLoading,
    mutate, // Exposing mutate for re-fetching or updating user data locally
  };
}