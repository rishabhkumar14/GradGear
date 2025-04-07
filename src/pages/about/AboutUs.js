import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import bagIcon from "../../assets/headers/ic_glass_bag.png";
import buyIcon from "../../assets/headers/ic_glass_buy.png";
import msgIcon from "../../assets/headers/ic_glass_message.png";
import userIcon from "../../assets/headers/ic_glass_users.png";
import "../../styles/finances.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FinancesIncome from "./AboutUsData";
import AboutUsData from "./AboutUsData";

export default function Contribute(props) {
  const [value, setValue] = React.useState(0);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "#f0f0f9",
        flexGrow: 1,
        p: 3,
        transition: "margin-left 0.3s ease",
        marginLeft: `${props.drawerOpen ? 200 : 0}px`,
        width: `calc(100% - ${props.drawerOpen ? 200 : 0}px)`,
        height: "200vh",
      }}
    >
      <br />
      <Grid
        container
        className="finances-container"
        justifyContent="space-evenly"
        spacing={3}
        style={{
          paddingLeft: 70,
          paddingBottom: "40px",
          paddingRight: 40,
        }}
      >
        <Grid item xs={12}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <AboutUsData />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
