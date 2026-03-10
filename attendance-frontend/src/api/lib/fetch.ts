import {getRawToken} from "../../auth/token";

function defaultAuthHeader() {
  return {
    'Authorization': 'Bearer ' + getRawToken()
  }
}
export function pfetch(url: string, ...args: any[]): Promise<Response> {
  console.log('url', url)
  if(args.length === 0) args.push({
    headers: defaultAuthHeader()
  })
  else if(typeof args[0] === 'object' && !args[0].headers?.Authorization)
    args[0].headers = {...args[0].headers || {}, ...defaultAuthHeader()}

  const urlTest = `${import.meta.env.VITE_API_URL}${url}`
  console.log('urlTest', urlTest)

  return fetch(`${import.meta.env.VITE_API_URL}${url}`, ...args)
}