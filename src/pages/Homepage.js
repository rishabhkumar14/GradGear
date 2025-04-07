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
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import bagIcon from "../assets/headers/ic_glass_bag.png";
import buyIcon from "../assets/headers/ic_glass_buy.png";
import msgIcon from "../assets/headers/ic_glass_message.png";
import userIcon from "../assets/headers/ic_glass_users.png";
import "../styles/dashboard.css";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
// import { highlightSelectedNavItem } from "../SideNavigation";
import VendorData from "./VendorData";

function Homepage(props) {
  let cardMetrics = [
    {
      title: "Weekly Usage",
      metrics: "71k",
      emoji: bagIcon,
    },
    {
      title: "New Users",
      metrics: "200k",
      emoji: userIcon,
    },
    {
      title: "Total Resources",
      metrics: "50k",
      emoji: buyIcon,
    },
    {
      title: "Students Helped",
      metrics: "200",
      emoji: msgIcon,
    },
    {
      title: "AI Queries Solved",
      metrics: "320",
      emoji: buyIcon,
    },
    {
      title: "Contributers",
      metrics: "25",
      emoji: bagIcon,
    },
  ];

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
        justifyContent="space-evenly"
        spacing={2}
        style={{
          paddingTop: "20px",
          paddingLeft: 70,
          paddingBottom: "40px",
          paddingRight: 40,
        }}
        className="dashboard-container"
      >
        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <Typography
                align="left"
                style={{
                  fontSize: 40,
                  paddingTop: "30px",
                  paddingBottom: "20px",
                }}
                variant="h2"
              >
                Welcome to, GradGear
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ alignItems: "left" }}>
              <Typography
                align="left"
                style={{
                  fontSize: "15px",
                  color: "#707070",
                }}
              >
                GradGear is an AI platform that helps unpaid workers navigate
                free resources often overlooked due to being scattered across
                departments. It simplifies access, ensuring users discover tools
                for skill development and career growth in the future of work.
              </Typography>
              <br />
              <Button
                component={Link}
                to="/resources"
                variant="contained"
                color="primary"
                size="small"
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={7}>
          <Grid
            container
            justifyContent="space-evenly"
            spacing={2}
            style={{ paddingTop: 25 }}
          >
            {cardMetrics.map((card) => {
              return (
                <Grid item xs={12} sm={4}>
                  <Paper
                    component={Stack}
                    spacing={3}
                    direction="row"
                    className="paper2"
                    sx={{
                      px: 3,
                      py: 5,
                      borderRadius: 2,
                      padding: 2,
                    }}
                  >
                    {<img alt="icon" src={card.emoji} /> && (
                      <Box sx={{ width: 64, height: 64 }}>
                        {<img alt="icon" src={card.emoji} />}
                      </Box>
                    )}

                    <Stack spacing={0.5}>
                      <Typography variant="h4">{card.metrics}</Typography>

                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.disabled" }}
                      >
                        {card.title}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-evenly"
            spacing={2}
            style={{
              paddingTop: "40px",
              paddingBottom: "40px",
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
                <VendorData />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Homepage;
