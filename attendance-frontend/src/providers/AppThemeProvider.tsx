import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import i18n from "../i18n";
import { createAppTheme } from "../theme/theme";

const RTL_LANG_PREFIXES = new Set(["ar", "he", "fa", "ur"]);

function directionForLanguage(lng: string): "rtl" | "ltr" {
  const base = lng.split("-")[0]?.toLowerCase() ?? "en";
  return RTL_LANG_PREFIXES.has(base) ? "rtl" : "ltr";
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: "muiltr",
});

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handler = (lng: string) => setLanguage(lng);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  const direction = useMemo(
    () => directionForLanguage(language),
    [language],
  );

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language.split("-")[0] || "en";
  }, [direction, language]);

  const theme = useMemo(() => createAppTheme(direction), [direction]);
  const emotionCache = direction === "rtl" ? cacheRtl : cacheLtr;

  return (
    <CacheProvider value={emotionCache} key={direction}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
