import { useAuth } from '@/contexts/AuthContext';
import { UpdateUserPayload } from '@/types'; // Import the new payload type
import { useSWRConfig } from 'swr';

export function useUserMutations() {
  const { user, token } = useAuth();
  const { mutate } = useSWRConfig();

  // Renamed to be more generic
  const updateUserProfile = async (payload: UpdateUserPayload) => {
    if (!user || !token) {
      throw new Error('User is not authenticated');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // Send the payload object
    });

    if (!response.ok) {
      throw new Error('Failed to update profile.');
    }

    // Re-fetch user data to update the UI everywhere
    mutate([`/users/${user.uid}`, token]);
  };

  return {
    updateUserProfile,
  };
}