import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const Banner: React.FC = () => {
  return (
    <Box mt={4} mb={2}>
      <Card sx={{ backgroundColor: '#e53935', color: '#fff' }}>
        <CardContent>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            87th National Book Week
          </Typography>
          <Typography variant="body1">
            Virtual Closing Program
            <br />
            Awarding of Winners & Launching of Library Website
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="body2">December 3, 2021</Typography>
            <Typography variant="body2">9:00 AM</Typography>
            <Typography variant="body2">Via Zoom</Typography>
          </Box>
          <Typography variant="body1" mt={2}>
            Meeting ID: 931 2364 8745
          </Typography>
        </CardContent>
        <Box
          component="img"
          src="/path/to/banner-image.png"
          alt="Library Building"
          sx={{ width: '100%', height: 'auto', mt: 2 }}
        />
      </Card>
    </Box>
  );
};

export default Banner;
