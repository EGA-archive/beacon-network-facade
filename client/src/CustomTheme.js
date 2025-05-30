import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #0234524d !important",
            borderRadius: "10px",
            boxShadow: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #3176B1 !important",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #3176B1 !important",
          },
        },
        paper: {
          // Styles for the dropdown popover
          borderRadius: "10px",
          border: "1px solid #0234524d",
          boxShadow: "none",
        },
        listbox: {
          // Styles for the listbox
          padding: "0px",
          "& .MuiAutocomplete-option": {
            borderRadius: "5px",
            "&[aria-selected='true']": {
              backgroundColor: "#F4F9FE !important",
            },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: "0px",
          marginRight: "0px",
          color: "#FF0000",
        },
      },
    },
    // Variant query tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#FFFFFF",
          color: "#000000",
          border: "1px solid #023452",
          fontSize: "14px",
          padding: "5px 10.83px",
          borderRadius: "5px",
          maxWidth: "430px",
        },
        arrow: {
          color: "#023452",
          // transform: "translate(1px, 0px) !important",
        },
      },
    },

    // Row
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: "52px",
        },
      },
      variants: [
        {
          props: { variant: "emptyRow" },
          style: {
            height: 0,
            padding: 0,
            border: "none",
          },
        },
      ],
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #DBEEFD",
        },
      },
      variants: [
        {
          props: { variant: "lessPadding" },
          style: {
            padding: "6px 16px 6px 16px",
            borderBottom: "1px solid #3176B1",
          },
        },
        {
          props: { variant: "lessPaddingSingle" },
          style: {
            padding: "6px 16px 6px 16px",
          },
        },
        {
          props: { variant: "noBorder" },
          style: {
            border: "none",
          },
        },
      ],
    },
  },
});

export default customTheme;
