import {
  createTheme,
  Theme,
  alpha,
  responsiveFontSizes,
} from "@mui/material/styles";

interface CustomColors {
  white: string;
  aquamarine: string;
  golden: string;
  grey: string;
}

const customColors: CustomColors = {
  white: "#FFFCF6",
  aquamarine: "#41EAD4",
  golden: "#D4BB3B",
  grey: "#A4A2A2",
};

const defaultColors = {
  primary: "#022420",
  secondary: "#00AA96",
  error: "#B03E3E",
};

declare module "@mui/material/styles" {
  interface Theme {
    customColors: CustomColors;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customColors: CustomColors;
  }
}
let theme: Theme = createTheme({
  customColors,
  spacing: 10,
  palette: {
    primary: {
      main: defaultColors.primary,
      light: alpha(defaultColors.primary, 0.8),
    },
    secondary: { main: defaultColors.secondary },
  },
  typography: {
    h1: {
      letterSpacing: -2,
      fontSize: 12,
      lineHeight: 9,
      "@media (max-width:900px)": {
        fontSize: 8.6,
      },
    },
    h2: {
      letterSpacing: 1.5,
      fontSize: 6,
      lineHeight: 7.4,
      "@media (max-width:1200px)": {
        fontSize: 5.6,
      },
      "@media (max-width:900px)": {
        fontSize: 3,
      },
      "@media (max-width:600px)": {
        fontSize: 2.6,
      },
    },
    h3: {
      letterSpacing: 1.5,
      fontSize: 2,
      "@media (max-width:1536px)": {
        fontSize: 1.8,
      },
      "@media (max-width:900px)": {
        fontSize: 1.6,
      },
      "@media (max-width:600px)": {
        fontSize: 1.4,
      },
    },
    body1: {
      letterSpacing: "1.5%",
      fontSize: 1.8,
      lineHeight: "140",
      "@media (max-width:1200px)": {
        fontSize: 1.6,
      },
      "@media (max-width:600px)": {
        fontSize: 1.3,
      },
    },
    button: {
      letterSpacing: "15%",
      fontSize: 1.6,
      "@media (max-width:900px)": {
        fontSize: 1.4,
      },
      "@media (max-width:600px)": {
        fontSize: 1.2,
      },
    },
    fontFamily: [
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

theme = responsiveFontSizes(theme);

export default theme;
