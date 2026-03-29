import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LectureProvider } from "./context/LectureContext";
import { AppThemeProvider } from "./providers/AppThemeProvider";
import App from "./App";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <BrowserRouter>
      <LectureProvider>
        <App />
      </LectureProvider>
    </BrowserRouter>
  </AppThemeProvider>,
);
