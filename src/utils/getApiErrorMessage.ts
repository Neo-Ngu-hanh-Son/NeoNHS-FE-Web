/**
 * Extracts a user-friendly error message from an API error.
 * The apiClient interceptor puts the backend's `message` field into Error.message.
 * Falls back to a generic message if extraction fails.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
