import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import Copyright from './Copyright';
import UNCLogo from '../../assets/images/unc-logo.png';

const Footer: React.FC = () => {
  return (
    <Box bgcolor="#3D3D3D" color="white">
      <Box display="flex" justifyContent="space-evenly" alignItems="center" py={4}>

        {/* LOGO ALIGNMENT */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <img src={ UNCLogo} alt="University Logo" height={60} />
          <Box ml={2}>
            <Typography>UNIVERSITY OF</Typography>
            <Typography>NUEVA CACERES</Typography>
          </Box>
        </Box>

        {/* INFORMATION ALIGNMENT */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box ml={2} display="flex" flexDirection="column" alignItems="center">
            <Typography >J. Hernandez Avenue, Naga City 4404</Typography>
            <Typography >09561301775 | 09071566898</Typography>
            <Link href="mailto:info@unc.edu.ph"  color="inherit">
              info@unc.edu.ph
            </Link>
            <Link href="mailto:admission@unc.edu.ph"  color="inherit">
              admission@unc.edu.ph
            </Link>
          </Box>
        </Box>

        {/* ICON ALIGNMENT */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Link href="https://www.youtube.com/@UniversityofNuevaCaceres" target="_blank" color="inherit">
            <img
              src="src\assets\svg\youtube.svg"
              alt="YouTube"
              height={50}
              width={50}
            />
          </Link>

          <Link href="https://www.facebook.com/UniversityOfNuevaCaceres" target="_blank" color="inherit">
            <img
              src="src\assets\svg\facebook.svg"
              alt="Facebook"
              height={50}
              width={50}
            />
          </Link>

          <Link href="https://www.instagram.com/uncgreyhounds/" target="_blank" color="inherit">
            <img
              src="src\assets\svg\instagram.svg"
              alt="Instagram"
              height={50}
              width={50}
            />
          </Link>
        </Box>
      </Box>
      <Copyright/>
    </Box>
  );
};

export default Footer;
