import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { LectureProvider } from "./context/LectureContext";
import App from "./App";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <LectureProvider>
        <App />
      </LectureProvider>
    </BrowserRouter>
  </ThemeProvider>,
);
