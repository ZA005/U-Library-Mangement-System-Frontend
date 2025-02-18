import React from "react";
import { Box, Typography, Link, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import Copyright from "./Copyright";
import UNCLogo from "../../assets/images/unc-logo.png";
import YTLogo from "../../assets/svg/youtube.svg";
import FBLogo from "../../assets/svg/facebook.svg";
import IGLogo from "../../assets/svg/instagram.svg";

const Footer: React.FC = () => {
  const theme = useTheme(); // Get the theme
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return <Copyright />;
  }

  return (
    <Box bgcolor="#3D3D3D" color="white" py={5}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-evenly"
        textAlign="center"
        gap={3}
        px={2}
      >
        {/* LOGO SECTION */}
        <Box display="flex" alignItems="center">
          <img src={UNCLogo} alt="University Logo" height={50} />
          <Box ml={2}>
            <Typography fontSize="16px" fontWeight="bold">
              UNIVERSITY OF
            </Typography>
            <Typography fontSize="16px" fontWeight="bold">
              NUEVA CACERES
            </Typography>
          </Box>
        </Box>

        {/* CONTACT INFORMATION */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography fontSize="14px">J. Hernandez Avenue, Naga City 4404</Typography>
          <Typography fontSize="14px">09561301775 | 09071566898</Typography>
          <Link href="mailto:info@unc.edu.ph" color="inherit" fontSize="14px">
            info@unc.edu.ph
          </Link>
          <Link href="mailto:admission@unc.edu.ph" color="inherit" fontSize="14px">
            admission@unc.edu.ph
          </Link>
        </Box>

        {/* SOCIAL MEDIA ICONS */}
        <Box display="flex" gap={2}>
          <Link href="https://www.youtube.com/@UniversityofNuevaCaceres" target="_blank">
            <img src={YTLogo} alt="YouTube" height={40} width={40} />
          </Link>
          <Link href="https://www.facebook.com/UniversityOfNuevaCaceres" target="_blank">
            <img src={FBLogo} alt="Facebook" height={35} width={35} />
          </Link>
          <Link href="https://www.instagram.com/uncgreyhounds/" target="_blank">
            <img src={IGLogo} alt="Instagram" height={40} width={40} />
          </Link>
        </Box>
      </Box>

      {/* COPYRIGHT */}
      <Copyright />
    </Box>
  );
};

export default Footer;
