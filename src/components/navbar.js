import * as React from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import InfoIcon from "@mui/icons-material/Info";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";

// Import images
import rishabhAvtar from "../assets/rishabh.png";
import logo from "../assets/logo.png";

const drawerWidth = 240;

export default function Navbar(props) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items array
  const navItems = [
    { text: "Homepage", icon: <HomeIcon />, path: "/homepage" },
    { text: "Resources", icon: <FolderIcon />, path: "/resources" },
    { text: "AI-Assistant", icon: <SmartToyIcon />, path: "/ai-assistant" },
    { text: "About Us", icon: <InfoIcon />, path: "/aboutus" },
  ];

  // Function to check if a nav item is active
  const isActive = (path) => {
    return (
      currentPath === path ||
      (path !== "/homepage" && currentPath.startsWith(path))
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#363740" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={props.toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            {props.drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="RetailHub Logo"
              style={{ height: 45, paddingTop: "10px" }}
            />
          </Link>

          <Avatar
            alt="Rishabh Kumar"
            src={rishabhAvtar}
            sx={{
              width: 40,
              height: 40,
              marginLeft: "auto",
              marginRight: "10px",
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#363740",
            transition: "transform 0.3s ease-in-out",
            transform: props.drawerOpen
              ? "none"
              : `translateX(-${drawerWidth}px)`,
          },
        }}
        open={props.drawerOpen}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#363740",
          }}
        >
          {/* Main navigation items */}
          <Box>
            <List sx={{ py: 0 }}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItem
                    key={item.text}
                    disablePadding
                    className="nav-item"
                    sx={{
                      display: "block",
                      my: 0.5, // Add margin between menu items
                    }}
                  >
                    <Link
                      to={item.path}
                      style={{
                        textDecoration: "none",
                        width: "100%",
                        display: "block",
                      }}
                    >
                      <ListItemButton
                        sx={{
                          pl: 3, // Extra left padding
                          minHeight: 54, // Increased height here
                          py: 1.5, // Additional vertical padding
                          backgroundColor: active
                            ? "rgba(255, 255, 255, 0.15)"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: active
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(255, 255, 255, 0.1)",
                          },
                          // Add left highlight for active item
                          borderLeft: active
                            ? "4px solid #ffffff"
                            : "4px solid transparent",
                          position: "relative",
                          overflow: "hidden",
                          textShadow: active
                            ? "0 0 1px rgba(0,0,0,0.5)"
                            : "none",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: active ? "#ffffff" : "#eeeeee",
                            minWidth: 40,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: active ? "#ffffff" : "#eeeeee",
                                fontWeight: active ? 600 : 400,
                                fontSize: "0.95rem", // Slightly larger font
                                position: "relative",
                                zIndex: 2, // Ensure text is above any background
                              }}
                            >
                              {item.text}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)", my: 1 }} />
          </Box>

          {/* Bottom contribute button */}
          <Box sx={{ mt: "auto" }}>
            <List sx={{ py: 0 }}>
              <ListItem
                disablePadding
                className="nav-item"
                sx={{
                  display: "block",
                  mb: 2, // Add bottom margin
                  mt: 0.5, // Add top margin
                }}
              >
                <Link
                  to="/contribute"
                  style={{
                    textDecoration: "none",
                    width: "100%",
                    display: "block",
                  }}
                >
                  <ListItemButton
                    sx={{
                      pl: 3, // Extra left padding
                      minHeight: 54, // Increased height here
                      py: 1.5, // Additional vertical padding
                      backgroundColor: isActive("/contribute")
                        ? "rgba(255, 255, 255, 0.15)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive("/contribute")
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      },
                      // Add left highlight for active item
                      borderLeft: isActive("/contribute")
                        ? "4px solid #ffffff"
                        : "4px solid transparent",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive("/contribute") ? "#ffffff" : "#eeeeee",
                        minWidth: 40,
                      }}
                    >
                      <VolunteerActivismIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            color: isActive("/contribute")
                              ? "#ffffff"
                              : "#eeeeee",
                            fontWeight: isActive("/contribute") ? 600 : 400,
                            fontSize: "0.95rem", // Slightly larger font
                            position: "relative",
                            zIndex: 2, // Ensure text is above any background
                          }}
                        >
                          Contribute
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
