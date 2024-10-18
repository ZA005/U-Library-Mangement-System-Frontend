import React from 'react';
import { Box, Button } from '@mui/material';

const ActionButtons: React.FC = () => {
  return (
    <Box mt={4} display="flex" justifyContent="center" gap={2} marginBottom= "40px">
      <Button variant="contained" color="error">
        Reserve a Book
      </Button>
      <Button variant="contained" color="error">
        Public Access Catalog
      </Button>
      <Button variant="contained" color="error">
        Contact Support
      </Button>
    </Box>
  );
};

export default ActionButtons;
