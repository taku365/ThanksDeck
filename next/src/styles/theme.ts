import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    background: {
      default: '#FFF9D6',
    },
    text: {
      primary: '#0A1930',
    },
    primary: {
      main: '#0A1930',
    },
    secondary: {
      main: '#FF9900',
    },
  },
  typography: {
    fontFamily: '"Not Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
})

export default theme
