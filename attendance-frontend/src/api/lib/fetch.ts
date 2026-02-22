export function pfetch(url: string, ...args: any[]): Promise<Response> {
  if(args.length === 0) args.push({
    credentials: 'include'
  })
  else if(typeof args[0] === 'object' && !args[0].hasOwnProperty("credentials"))
    args[0].credentials = 'include'

  return fetch(`${import.meta.env.VITE_API_URL}${url}`, ...args)
}