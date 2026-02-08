export function pfetch(url: string, args: any): Promise<any> {
  return fetch(`${import.meta.env.VITE_API_URL}${url}`, ...args)
}