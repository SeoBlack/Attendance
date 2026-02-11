export function pfetch(url: string, ...args: any[]): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}${url}`, ...args)
}