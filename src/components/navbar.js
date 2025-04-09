import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Avatar, useMediaQuery, useTheme } from "@mui/material";
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
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Determine variant based on screen size
  const drawerVariant = isMobile ? "temporary" : "permanent";
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

  // Handle logo click
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/homepage");
    if (isMobile) {
      props.toggleDrawer();
    }
  };

  const drawer = (
    <>
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
                    my: 0.5,
                  }}
                  onClick={isMobile ? props.toggleDrawer : undefined}
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
                        pl: 3,
                        minHeight: { xs: 48, sm: 54 },
                        py: { xs: 1, sm: 1.5 },
                        backgroundColor: active
                          ? "rgba(255, 255, 255, 0.15)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: active
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        },
                        borderLeft: active
                          ? "4px solid #ffffff"
                          : "4px solid transparent",
                        position: "relative",
                        overflow: "hidden",
                        textShadow: active ? "0 0 1px rgba(0,0,0,0.5)" : "none",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: active ? "#ffffff" : "#eeeeee",
                          minWidth: { xs: 35, sm: 40 },
                          fontSize: { xs: "1.1rem", sm: "1.25rem" },
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
                              fontSize: { xs: "0.85rem", sm: "0.95rem" },
                              position: "relative",
                              zIndex: 2,
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
                mb: 2,
                mt: 0.5,
              }}
              onClick={isMobile ? props.toggleDrawer : undefined}
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
                    pl: 3,
                    minHeight: { xs: 48, sm: 54 },
                    py: { xs: 1, sm: 1.5 },
                    backgroundColor: isActive("/contribute")
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isActive("/contribute")
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                    },
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
                      minWidth: { xs: 35, sm: 40 },
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
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                          position: "relative",
                          zIndex: 2,
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
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#363740",
          width: "100%",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={props.toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            {props.drawerOpen && !isMobile ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Box
            onClick={handleLogoClick}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="GradGear Logo"
              style={{
                height: isMobile ? 35 : 45,
                marginTop: isMobile ? 5 : 10,
              }}
            />
          </Box>

          <Avatar
            alt="User"
            src={rishabhAvtar}
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              marginLeft: "auto",
              marginRight: { xs: 0, sm: "10px" },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Mobile: Temporary drawer that closes on selection */}
      {isMobile ? (
        <Drawer
          variant={drawerVariant}
          open={props.drawerOpen}
          onClose={props.toggleDrawer}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#363740",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        // Desktop: Permanent drawer that slides
        <Drawer
          variant={drawerVariant}
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
          {drawer}
        </Drawer>
      )}
    </Box>
  );
}
