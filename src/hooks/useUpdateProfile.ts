import { useState } from 'react';

interface UpdateProfileData {
  hardPreferences?: string;
  softPreferences?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
}

export const useUpdateProfile = (token: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
    if (!token) {
      const errorMsg = 'No authentication token available';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update profile' }));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      setIsLoading(false);
      return { success: true, ...result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
};
