import React, { useState } from "react";
import loadable from "@loadable/component";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Backdrop, Typography, Box, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../config/menuConfig";

const LogoutIcon = loadable(() => import("lucide-react").then((icon) => ({ default: icon.LogOut })));
const HomeIcon = loadable(() => import("lucide-react").then((icon) => ({ default: icon.Home })));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { logout, role, id } = useAuth();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/");
    onClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
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
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
        onClose={onClose}
      >
        <DrawerHeader />

        <List>
          <ListItem>
            <Box>
              <Typography variant="h5" fontWeight="bold">{role}</Typography>
              <Typography variant="subtitle2">{id}</Typography>
            </Box>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation("/")}>
              <ListItemIcon sx={{ color: "white" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {roleMenu.map((item, index) => (
            <React.Fragment key={index}>
              {item.children ? (
                <>
                  <ListItemButton onClick={() => handleToggle(item.label)}>
                    <ListItemIcon sx={{ color: "white" }}>
                      {React.createElement(item.icon, { color: "white", size: 20 })}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child, idx) => (
                        <ListItemButton key={idx} sx={{ pl: 4 }} onClick={() => handleNavigation(child.path)}>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton onClick={() => handleNavigation(item.path)}>
                  <ListItemIcon sx={{ color: "white" }}>
                    {React.createElement(item.icon, { color: "white", size: 20 })}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </React.Fragment>
          ))}

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: "white" }}>
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
