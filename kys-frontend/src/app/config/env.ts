const rawApiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()

export const env = {
  apiBaseUrl: rawApiBaseUrl ?? '',
}
