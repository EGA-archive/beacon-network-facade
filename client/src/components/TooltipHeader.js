import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { padding, margin } from "@mui/system";

// Custom styling for the tooltip
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    border: "1px solid #023452",
    fontSize: "14px",
    padding: "5px 10.83px",
    borderRadius: "5px",
    maxWidth: "430px",
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#023452",
  },
  "&.custom-margin-right": {
    [`& .MuiTooltip-tooltip`]: {
      transform: "translateY(100%)",
      // right: "15%",
      transformOrigin: "center bottom",
    },
  },
});

// TooltipHeader component
const TooltipHeader = ({ title, children, customClass }) => {
  return (
    <CustomTooltip title={title} placement="top" arrow className={customClass}>
      {children}
    </CustomTooltip>
  );
};

export default TooltipHeader;
