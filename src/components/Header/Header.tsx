import React, { useState } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import eliblogo from "../../assets/images/lms-logo.png";
import loadable from "@loadable/component";

interface HeaderProps {
  buttons?: React.ReactNode;
  title?: React.ReactNode;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}

const MenuIcon = loadable(() => import("@mui/icons-material/Menu"));
const Sidebar = loadable(() => import("../Sidebar"));

const Header: React.FC<HeaderProps> = ({ buttons, title, setSidebarOpen, sidebarOpen }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isHomePage = location.pathname === "/";

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
        sx={{
          borderBottom: "2px solid lightgrey",
          marginBottom: "30px"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Section - Logo & Title */}
          <Box display="flex" alignItems="center">
            <img src={eliblogo} alt="Library Logo" height={40} />
            <Box ml={2} display="flex" flexDirection="column">
              <Typography
                variant="caption"
                fontSize="14px"
                fontWeight="bold"
                sx={{ fontFamily: "Spartan, sans-serif !important" }}
              >
                <span style={{ color: "red" }}>A</span>CQUIRE
              </Typography>
              <Typography variant="caption" fontSize="12px">
                Library Management System
              </Typography>
            </Box>
          </Box>

          {/* Right Section - Buttons */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>{buttons}</Box>

          {/* Menu Icon for Mobile */}
          {isMobile && (
            <IconButton
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={() =>
                isHomePage ? setMobileOpen(true) : setSidebarOpen(prev => !prev)
              }
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar now correctly responds to sidebarOpen state */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Drawer for Home Page Buttons */}
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
