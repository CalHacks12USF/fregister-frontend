/**
 * API fetcher utility function to make authenticated requests to the backend.
 * @param url The endpoint URL (without the base URL)
 * @param token Optional Bearer token for authentication 
 * @returns 
 */
export const apiFetcher = async ([url, token]: [string, string?]) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    headers,
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    try {
      (error as any).info = await res.json();
    } catch (e) {
      (error as any).info = await res.text();
    }
    (error as any).status = res.status;
    throw error;
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return res.json();
  }
  return res.text();
};