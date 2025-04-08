import * as React from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Import icons
import bagIcon from "../../assets/headers/ic_glass_bag.png";
import buyIcon from "../../assets/headers/ic_glass_buy.png";
import msgIcon from "../../assets/headers/ic_glass_message.png";
import userIcon from "../../assets/headers/ic_glass_users.png";

// Import homepage table
import VendorData from "./HomePageTable";

function Homepage(props) {
  let cardMetrics = [
    {
      title: "Navigator",
      metrics: "Resource",
      emoji: bagIcon,
      link: "/resources",
      isFeature: true,
      color: "rgba(25, 118, 210, 0.1)", // Slightly more visible blue
      textColor: "#1976d2",
    },
    {
      title: "New Users",
      metrics: "200k",
      emoji: userIcon,
      color: "white", // Original color
      textColor: "inherit", // Original color
    },
    {
      title: "Total Resources",
      metrics: "50k",
      emoji: buyIcon,
      color: "white", // Original color
      textColor: "inherit", // Original color
    },
    {
      title: "AI Assistant",
      metrics: "Get Help",
      emoji: msgIcon,
      link: "/ai-assistant",
      isFeature: true,
      color: "rgba(25, 118, 210, 0.1)", // Slightly more visible blue
      textColor: "#1976d2",
    },
    {
      title: "AI Queries Solved",
      metrics: "320",
      emoji: buyIcon,
      color: "white", // Original color
      textColor: "inherit", // Original color
    },
    {
      title: "Contributers",
      metrics: "25",
      emoji: bagIcon,
      color: "white", // Original color
      textColor: "inherit", // Original color
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
            {cardMetrics.map((card, index) => {
              // For non-feature cards, use original styling
              const isOriginalCard = !card.isFeature;
              const isFirstCard = index === 0;
              const isAICard = index === 3;

              return (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    component={card.isFeature ? Link : Stack}
                    to={card.isFeature ? card.link : undefined}
                    spacing={3}
                    direction="row"
                    className="paper2"
                    sx={{
                      px: 3,
                      py: card.isFeature ? 4.2 : 5,
                      borderRadius: 2,
                      padding: 2,
                      bgcolor: card.color,
                      transition: "all 0.2s",
                      border: card.isFeature
                        ? "1px solid rgba(25, 118, 210, 0.2)"
                        : "none",
                      "&:hover": {
                        transform: card.isFeature ? "translateY(-4px)" : "none",
                        boxShadow: card.isFeature
                          ? "0 4px 12px rgba(25, 118, 210, 0.2)"
                          : "none",
                        bgcolor: card.isFeature
                          ? "rgba(25, 118, 210, 0.15)"
                          : card.color,
                      },
                      textDecoration: "none",
                      display: "flex",
                      position: "relative", // For arrow positioning
                    }}
                  >
                    {<img alt="icon" src={card.emoji} /> && (
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          mr: card.isFeature ? 2 : 0,
                        }}
                      >
                        {<img alt="icon" src={card.emoji} />}
                      </Box>
                    )}

                    <Stack spacing={0.2}>
                      {" "}
                      {/* Reduced spacing between metrics and title */}
                      <Typography
                        variant="h4"
                        sx={{
                          color: isOriginalCard ? "inherit" : card.textColor,
                          fontSize: card.isFeature ? "1.75rem" : undefined,
                        }}
                      >
                        {card.metrics}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: isOriginalCard
                            ? "text.disabled"
                            : card.textColor,
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Stack>

                    {/* Slightly larger arrow indicator for feature cards */}
                    {card.isFeature && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: 12,
                          bottom: 12,
                          color: card.textColor,
                          opacity: 0.7,
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: "1.05rem" }} />{" "}
                        {/* 5% bigger */}
                      </Box>
                    )}
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
