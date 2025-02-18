import React, { useState } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Style from "./Header.module.css";
import LibraryLogo from "../../assets/images/lms-logo.png";
import { Helmet } from "react-helmet";
import eliblogo from "../../assets/images/lms-logo.png";

interface HeaderProps {
  buttons?: React.ReactNode;
  title?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ buttons, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/png" href={eliblogo} />
      </Helmet>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className={Style.bottomLine}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Section - Logo & Title */}
          <Box display="flex" alignItems="center">
            <img src={LibraryLogo} alt="Library Logo" height={40} />
            <Box ml={2} display="flex" flexDirection="column">
              <Typography
                variant="caption"
                fontSize="14px"
                fontWeight="bold"
                className={Style.spartan}
                sx={{ fontFamily: "Spartan, sans-serif !important" }}
              >
                <span className={Style.title}>A</span>CQUIRE
              </Typography>
              <Typography variant="caption" fontSize="12px">
                Library Management System
              </Typography>
            </Box>
          </Box>

          {/* Right Section - Buttons */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>{buttons}</Box>

          {/* Mobile Menu Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer for Buttons */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 250, padding: 2 } }}
      >
        {buttons}
      </Drawer>
    </>
  );
};

export default Header;
