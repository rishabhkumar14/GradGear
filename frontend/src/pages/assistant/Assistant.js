import * as React from "react";
import { Box, Grid } from "@mui/material";
import AIAssistant from "./AIAssistant.js";

export default function Assistant(props) {
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
        height: "110vh",
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
            <AIAssistant />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
