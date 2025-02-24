import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: "61px",
        },
      },
    },
  },
});

export default theme;
