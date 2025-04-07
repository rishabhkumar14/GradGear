import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  Chip,
  Link,
  Card,
  CardContent,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import SmartToyIcon from "@mui/icons-material/SmartToy";

// Sample team data - replace with your actual team information
const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Project Lead",
    bio: "Computer Science graduate specializing in web applications and user experience design.",
    imageUrl: "/api/placeholder/150/150", // Replace with actual image
    email: "alex.johnson@example.com",
    github: "https://github.com/alexj",
    linkedin: "https://linkedin.com/in/alexj",
  },
  {
    id: 2,
    name: "Jamie Smith",
    role: "UI/UX Designer",
    bio: "Human-Computer Interaction specialist with a background in graphic design and psychology.",
    imageUrl: "/api/placeholder/150/150", // Replace with actual image
    email: "jamie.smith@example.com",
    github: "https://github.com/jamies",
    linkedin: "https://linkedin.com/in/jamies",
  },
  {
    id: 3,
    name: "Taylor Wong",
    role: "Full Stack Developer",
    bio: "Software engineer with experience in React, Node.js, and cloud infrastructure.",
    imageUrl: "/api/placeholder/150/150", // Replace with actual image
    email: "taylor.wong@example.com",
    github: "https://github.com/taylorw",
    linkedin: "https://linkedin.com/in/taylorw",
  },
];

// Project information
const projectInfo = {
  name: "RetailHub - Resources Portal",
  description:
    "A centralized platform for Northeastern University students to discover, locate, and reserve campus resources. Our mission is to improve accessibility to various technology, equipment, and spaces to enhance the learning experience.",
  technologies: [
    "React",
    "Material UI",
    "JavaScript",
    "Node.js",
    "AI Assistant Integration",
  ],
  highlights: [
    "Intuitive resource discovery and categorization",
    "Real-time availability tracking",
    "AI-powered assistance for finding the right resources",
    "Multi-device responsive design",
  ],
};

function AboutUsData(props) {
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
        minHeight: "100vh",
      }}
    >
      <Box sx={{ pt: 4, pb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: "1.8rem" }}
        >
          About Us
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Learn about our team and the resources portal project.
        </Typography>
      </Box>

      {/* Project Overview Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontSize: "1.4rem", fontWeight: 600, mb: 2 }}
        >
          Project Overview
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          {projectInfo.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}
          >
            Key Features
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {projectInfo.highlights.map((highlight, index) => (
              <Chip
                key={index}
                label={highlight}
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderColor: "transparent",
                  borderRadius: "6px",
                }}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}
          >
            Technologies Used
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {projectInfo.technologies.map((tech, index) => (
              <Chip
                key={index}
                label={tech}
                size="small"
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1565c0",
                  borderRadius: "6px",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Team Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontSize: "1.4rem",
          fontWeight: 600,
          mb: 3,
          borderBottom: "2px solid #e0e0e0",
          paddingBottom: "0.5rem",
        }}
      >
        Our Team
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {teamMembers.map((member) => (
          <Grid item xs={12} md={4} key={member.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "8px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={member.imageUrl}
                    alt={member.name}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {member.name}
                  </Typography>
                  <Chip
                    label={member.role}
                    size="small"
                    sx={{
                      backgroundColor: "#f3e5f5",
                      color: "#7b1fa2",
                      fontWeight: 500,
                      mb: 1,
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, textAlign: "center" }}
                >
                  {member.bio}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <Link href={`mailto:${member.email}`} underline="none">
                    <Avatar
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <EmailIcon fontSize="small" />
                    </Avatar>
                  </Link>
                  <Link href={member.github} target="_blank" underline="none">
                    <Avatar
                      sx={{
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <GitHubIcon fontSize="small" />
                    </Avatar>
                  </Link>
                  <Link href={member.linkedin} target="_blank" underline="none">
                    <Avatar
                      sx={{
                        bgcolor: "#e8eaf6",
                        color: "#3f51b5",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </Avatar>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Project Timeline */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontSize: "1.4rem", fontWeight: 600, mb: 2 }}
        >
          Project Journey
        </Typography>

        <Box sx={{ ml: 1 }}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mr: 2,
              }}
            >
              <Avatar sx={{ bgcolor: "#bbdefb", color: "#1565c0" }}>
                <SchoolIcon />
              </Avatar>
              <Box sx={{ width: 2, flexGrow: 1, bgcolor: "#bbdefb", mt: 1 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: 600 }}
              >
                Research & Planning
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                January 2025
              </Typography>
              <Typography variant="body2">
                Initial research and identification of campus resource
                challenges. User interviews and needs assessment conducted with
                students.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mr: 2,
              }}
            >
              <Avatar sx={{ bgcolor: "#c8e6c9", color: "#2e7d32" }}>
                <WorkIcon />
              </Avatar>
              <Box sx={{ width: 2, flexGrow: 1, bgcolor: "#c8e6c9", mt: 1 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: 600 }}
              >
                Design & Development
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                February - March 2025
              </Typography>
              <Typography variant="body2">
                UI/UX design prototyping and user testing. Core functionality
                development and integration with university systems.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mr: 2,
              }}
            >
              <Avatar sx={{ bgcolor: "#ffecb3", color: "#ff8f00" }}>
                <SmartToyIcon />
              </Avatar>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: 600 }}
              >
                AI Integration & Launch
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                April 2025
              </Typography>
              <Typography variant="body2">
                Implementation of AI assistant to help navigate resources. Beta
                testing and official launch to the university community.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Acknowledgments */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          This project was developed as part of the Human-Computer Interaction
          course at Northeastern University.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          © 2025 RetailHub Team. All rights reserved.
        </Typography>
      </Paper>
    </Box>
  );
}

export default AboutUsData;
