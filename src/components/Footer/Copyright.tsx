import React from "react";
import { Box, Typography } from "@mui/material";


const Copyright: React.FC = () => {
  return (
    <Box display="flex" bgcolor="#282828" alignItems="center" justifyContent="center" padding="5px" color="white">
      <Typography variant='caption'>&copy; 2023 University of Nueva Caceres. All Rights Reserved.</Typography>
    </Box>
  );
}

export default Copyright;