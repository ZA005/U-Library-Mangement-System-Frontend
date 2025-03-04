import React from "react";
import loadable from "@loadable/component";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Backdrop } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../config/menuConfig";

const LogoutIcon = loadable(() => import("@mui/icons-material/Logout"));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { logout, role } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/");
  };

  const roleMenu = menuItems[role as keyof typeof menuItems] || [];

  return (
    <>
      <Backdrop open={open} onClick={onClose} sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }} />
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "#282828",
            color: "#FFF",
            boxSizing: "border-box",
            transition: (theme) =>
              theme.transitions.create("transform", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader />
        <List>
          {roleMenu.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
