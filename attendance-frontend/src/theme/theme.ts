import { createTheme, Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    brand: { main: string; dark: string; contrastText: string };
    link: { main: string };
  }
  interface PaletteOptions {
    brand?: { main: string; dark: string; contrastText?: string };
    link?: { main: string };
  }
  interface PaletteColor {
    bg?: string;
  }
  interface SimplePaletteColorOptions {
    bg?: string;
  }
  interface TypeBackground {
    form: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    brand: true;
  }
}

const basePalette = {
  primary: {
    main: "#0D9488",
    light: "#14B8A6",
    dark: "#0F766E",
    contrastText: "#FFFFFF",
    bg: "#E6F7F5",
  },
  secondary: {
    main: "#7C3AED",
    light: "#8B5CF6",
    dark: "#6D28D9",
    contrastText: "#FFFFFF",
    bg: "#F3E8FF",
  },
  success: {
    main: "#22C55E",
    light: "#4ADE80",
    dark: "#16A34A",
    bg: "#DCFCE7",
  },
  warning: {
    main: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
    bg: "#FEF3C7",
  },
  error: {
    main: "#EF4444",
    light: "#F87171",
    dark: "#DC2626",
    bg: "#FEE2E2",
  },
  info: {
    main: "#3B82F6",
    light: "#60A5FA",
    dark: "#2563EB",
    bg: "#DBEAFE",
  },
  brand: {
    main: "#367D9C",
    dark: "#2d6a85",
    contrastText: "#FFFFFF",
  },
  link: {
    main: "#3399FF",
  },
  background: {
    default: "#F3F4F6",
    paper: "#FFFFFF",
    form: "#F7FAFC",
  },
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
  },
  divider: "#E5E7EB",
} as const;

export function createAppTheme(direction: "ltr" | "rtl"): Theme {
  const fontFamily =
    direction === "rtl"
      ? '"Tajawal", "Segoe UI", "Helvetica", "Arial", sans-serif'
      : '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

  return createTheme({
    direction,
    palette: basePalette,
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily,
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "0.875rem",
      },
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
          },
          containedPrimary: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
}
