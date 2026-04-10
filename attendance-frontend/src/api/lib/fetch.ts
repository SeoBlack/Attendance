import { getRawToken } from "../../auth/token";
import i18n from "../../i18n";

function defaultAuthHeader() {
  return {
    Authorization: "Bearer " + getRawToken(),
  };
}

/** Primary language subtag for localized API responses (matches DB locale keys: en, ar, ru). */
function acceptLanguageHeader(): { "Accept-Language": string } {
  const raw = (i18n.language || "en").split("-")[0] || "en";
  return { "Accept-Language": raw };
}

export function pfetch(url: string, ...args: any[]): Promise<Response> {
  console.log("url", url);
  if (args.length === 0)
    args.push({
      headers: { ...defaultAuthHeader(), ...acceptLanguageHeader() },
    });
  else if (typeof args[0] === "object") {
    const h = args[0].headers || {};
    if (!h.Authorization) args[0].headers = { ...h, ...defaultAuthHeader() };
    if (!h["Accept-Language"])
      args[0].headers = { ...args[0].headers, ...acceptLanguageHeader() };
  }

  const urlTest = `${import.meta.env.VITE_API_URL}${url}`;
  console.log("urlTest", urlTest);

  return fetch(`${import.meta.env.VITE_API_URL}${url}`, ...args);
}
