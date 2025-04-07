import * as React from "react";
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";
import Homepage from "../../pages/Homepage";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { Avatar } from "@mui/material";
import rishabhAvtar from "../../assets/rishabh.png";
import logo from "../../assets/logo.png";
import CardHeader from "@mui/material/CardHeader";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import InfoIcon from "@mui/icons-material/Info";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";

const drawerWidth = 240;

export default function Navbar(props) {
  const [open, setOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
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
            aria-label="open drawer"
            onClick={props.toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            {props.drawerOpen ? (
              <ChevronLeftIcon style={{ color: "white" }} />
            ) : (
              <MenuIcon style={{ color: "white" }} />
            )}
          </IconButton>
          <img className="logo" src={logo} alt="logo" style={{ height: 45 }} />

          <Avatar
            alt="Rishabh Kumar"
            src={rishabhAvtar}
            sx={{ width: 40, height: 40 }}
            style={{ marginLeft: "auto", marginRight: "10px" }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: props.drawerOpen ? drawerWidth : 0,

          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            ...(!props.drawerOpen && {
              transform: `translateX(-${drawerWidth}px)`,
            }),
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            backgroundColor: "#363740",
          }}
        >
          <div>
            <List>
              {[
                { text: "Homepage", icon: <HomeIcon /> },
                { text: "Resources", icon: <FolderIcon /> },
                {
                  text: "AI-Assistant",
                  icon: <SmartToyIcon />,
                },
                { text: "About Us", icon: <InfoIcon /> },
              ].map(({ text, icon }) => (
                <ListItem key={text} disablePadding className="nav-item">
                  <Link
                    to={"/" + text.replace(/\s/g, "").toLowerCase()}
                    style={{ textDecoration: "none" }}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Typography
                          sx={{
                            color: "white",
                          }}
                        >
                          {icon}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="h6"
                          noWrap
                          component="div"
                          sx={{
                            color: "white",
                            textDecoration: "none",
                            textUnderlineOffset: "0px",
                          }}
                        >
                          {text}
                        </Typography>
                      </ListItemText>
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>

            <Divider />
          </div>
          <div style={{ marginTop: "auto", cursor: "pointer" }}>
            <List>
              <ListItem key="contribute" disablePadding className="nav-item">
                <ListItemButton>
                  <ListItemIcon>
                    <Typography
                      sx={{
                        color: "white",
                      }}
                    >
                      <VolunteerActivismIcon />
                    </Typography>
                  </ListItemIcon>
                  <Link
                    to="/contribute"
                    className="nav-link"
                    style={{ textDecoration: "none" }}
                  >
                    <ListItemText>
                      <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                          color: "white",
                          textDecoration: "none",
                          textUnderlineOffset: "0px",
                        }}
                      >
                        {"Contribute"}
                      </Typography>
                    </ListItemText>
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
          </div>
        </Box>
      </Drawer>
    </Box>
  );
}
