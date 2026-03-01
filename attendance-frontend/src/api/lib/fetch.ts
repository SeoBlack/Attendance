import {getRawToken} from "../../auth/token";

function defaultAuthHeader() {
  return {
    'Authorization': 'Bearer ' + getRawToken()
  }
}
export function pfetch(url: string, ...args: any[]): Promise<Response> {
  if(args.length === 0) args.push({
    headers: defaultAuthHeader()
  })
  else if(typeof args[0] === 'object' && !args[0].headers?.Authorization)
    args[0].headers = {...args[0].headers || {}, ...defaultAuthHeader()}

  return fetch(`${import.meta.env.VITE_API_URL}${url}`, ...args)
}