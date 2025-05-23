import React, { useState } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import eliblogo from "../../assets/images/lms-logo.png";
import loadable from "@loadable/component";
import { PROTECTED_ROUTES } from "../../config/routeConfig";
import { Menu } from "lucide-react";
interface HeaderProps {
  buttons?: React.ReactNode;
  title?: React.ReactNode;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}
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
          <Link to={PROTECTED_ROUTES.BROWSE} style={{ textDecoration: "none", color: "inherit" }}>
            <Box display="flex" alignItems="center" sx={{ cursor: "pointer" }}>
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
          </Link>

          {/* Right Section - Buttons */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>{buttons}</Box>

          {/* Menu Icon for Mobile */}
          {isMobile && (
            <IconButton
              sx={{ display: { xs: "block", md: "none" }, color: "#d32f2f" }}
              onClick={() =>
                isHomePage ? setMobileOpen(true) : setSidebarOpen(prev => !prev)
              }
            >
              <Menu color="#d32f2f" />
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
