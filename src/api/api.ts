const urlVite = import.meta.env.VITE_API_URL;


export const TOKEN_KEY = "token";


export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;


  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    ...(isFormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${urlVite}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
   
    const data = await response.json().catch(() => null);
    const message = data?.error?.message ?? "שגיאה בתקשורת עם השרת";
    throw new ApiError(message, response.status, data?.error?.details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}