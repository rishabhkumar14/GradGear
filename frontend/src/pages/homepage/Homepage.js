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
  // State to control VendorData visibility
  const [showVendorData, setShowVendorData] = React.useState(false);

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
        marginLeft: {
          xs: 0,
          sm: `${props.drawerOpen ? 200 : 0}px`,
        },
        width: {
          xs: "100%",
          sm: `calc(100% - ${props.drawerOpen ? 200 : 0}px)`,
        },
        minHeight: "100vh",
        height: "auto",
        overflow: "hidden",
      }}
    >
      <br />

      <Grid
        container
        justifyContent="space-evenly"
        spacing={2}
        sx={{
          pt: { xs: 1, sm: 2.5 },
          pl: { xs: 0, sm: 8.75 },
          pr: { xs: 0, sm: 5 },
          pb: { xs: 3, sm: 5 },
          width: { xs: "100%", sm: "auto" },
          margin: { xs: 0 },
        }}
        className="dashboard-container"
      >
        {/* Welcome section - full width on mobile, partial on desktop */}
        <Grid item xs={12} md={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                align="left"
                sx={{
                  fontSize: { xs: 28, sm: 40 },
                  pt: { xs: 1, sm: 3.75 },
                  pb: { xs: 1, sm: 2.5 },
                }}
                variant="h2"
              >
                Welcome to, GradGear
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                align="left"
                sx={{
                  fontSize: "15px",
                  color: "#707070",
                }}
              >
                GradGear is an AI platform that helps unpaid workers navigate
                free resources often overlooked due to being scattered across
                departments. It simplifies access, ensuring users discover tools
                for skill development and career growth in the future of work.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  to="/resources"
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Empty column - only visible on larger screens */}
        <Grid
          item
          xs={0}
          md={1}
          sx={{ display: { xs: "none", md: "block" } }}
        ></Grid>

        {/* Metrics cards section */}
        <Grid item xs={12} md={7}>
          <Grid
            container
            justifyContent="space-evenly"
            spacing={2}
            sx={{ pt: { xs: 3, sm: 3.125 } }}
          >
            {cardMetrics.map((card, index) => {
              const isOriginalCard = !card.isFeature;

              return (
                <Grid item xs={6} sm={4} key={index}>
                  <Paper
                    component={card.isFeature ? Link : Stack}
                    to={card.isFeature ? card.link : undefined}
                    spacing={3}
                    direction="row"
                    className="paper2"
                    sx={{
                      px: { xs: 1, sm: 3 },
                      py: card.isFeature
                        ? { xs: 2, sm: 4.2 }
                        : { xs: 2, sm: 5 },
                      borderRadius: 2,
                      padding: { xs: 1, sm: 2 },
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
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    {<img alt="icon" src={card.emoji} /> && (
                      <Box
                        sx={{
                          width: { xs: 36, sm: 64 },
                          height: { xs: 36, sm: 64 },
                          mr: card.isFeature ? { xs: 0.5, sm: 2 } : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          alt="icon"
                          src={card.emoji}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    )}

                    <Stack
                      spacing={0.1}
                      sx={{ minWidth: 0, ml: { xs: 0.5, sm: 0 } }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: isOriginalCard ? "inherit" : card.textColor,
                          fontSize: {
                            xs: card.isFeature ? "1.1rem" : "1.2rem",
                            sm: card.isFeature ? "1.75rem" : undefined,
                          },
                          lineHeight: { xs: 1.2, sm: 1.3 },
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
                          fontSize: { xs: "0.65rem", sm: "0.8rem" },
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.2,
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Stack>

                    {/* Arrow indicator only visible on non-mobile screens */}
                    {card.isFeature && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          color: card.textColor,
                          opacity: 0.7,
                          display: { xs: "none", sm: "block" },
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: "1.1rem" }} />
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Table section - full width on all screens */}
        <Grid
          item
          xs={12}
          sx={{
            mt: { xs: 2, sm: 5 },
            mb: { xs: 2, sm: 5 },
            px: { xs: 0, sm: 0 },
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: 2,
              overflow: { xs: "auto", sm: "hidden" },
              filter: "blur(8px)", // Apply blur effect to the container
              pointerEvents: "none", // Prevent interaction with blurred content
            }}
          >
            {/* VendorData component is rendered but visually blurred */}
            <VendorData />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Homepage;
