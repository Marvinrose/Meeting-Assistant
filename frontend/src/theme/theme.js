import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#AA3BFF',
      dark: '#8A20D6',
      light: '#C875FF',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#6B6375',
    },

    background: {
      default: '#F8F7FA',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#17141C',
      secondary: '#6B6375',
    },

    divider: '#E5E4E7',
  },

  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
  },

  shape: {
    borderRadius: 5,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;