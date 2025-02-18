import React from "react";
import { Box, Typography } from "@mui/material";

const Copyright: React.FC = () => {
  return (
    <Box
      position='absolute'
      width='100%'
      bgcolor="#282828"
      alignItems="center"
      justifyContent="center"
      color="white"
      fontSize={{ xs: "10px", md: "12px" }}
      textAlign="center"
      bottom='0'
    >
      <Typography variant="caption">
        &copy; 2023 University of Nueva Caceres. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Copyright;
