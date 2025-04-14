import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
  IconButton,
  Link,
  Button,
  Rating,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

import { abousUsApi } from "../../services/api";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [feedbackType, setFeedbackType] = React.useState("general");
  const [feedbackText, setFeedbackText] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactSubject, setContactSubject] = React.useState("");
  const [contactMessage, setContactMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();

    console.log({
      rating,
      feedbackType,
      feedbackText,
    });

    try { 
     const response = await abousUsApi.shareFeedback({rating,feedbackType,feedbackText});
     if(response.success){
      setSnackbarMessage("Thank you for your feedback!");
      setIsError(false);
      setOpenSnackbar(true);
     }
     else {
      // Handle case when API returns success: false
      setSnackbarMessage("Sorry your feedback couldn't be updated right now. Please try again later.");
      setIsError(true);
      setOpenSnackbar(true);
    }
    }
    catch (err) {
      setSnackbarMessage("Sorry your feedback couldn't be updated right now. Please try again later");
      setIsError(true);
      setOpenSnackbar(true);
    }
    // Reset form
    setRating(0);
    setFeedbackType("general");
    setFeedbackText("");
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    console.log({
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      message: contactMessage,
    });

    try { 
      const response = await abousUsApi.contactUs({
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
      });
      if(response.success){
       setSnackbarMessage("Your message has been sent. We'll get back to you soon!");
       setOpenSnackbar(true);
      }
      else {
       // Handle case when API returns success: false
       setSnackbarMessage("Sorry we couldn't send your message right now. Please try again later.");
       setIsError(true);
       setOpenSnackbar(true);
     }
     }
     catch (err) {
      setSnackbarMessage("Sorry we couldn't send your message right now. Please try again later.");
      setIsError(true);
      setOpenSnackbar(true);
     }


    // Reset form
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessage("");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsError(false);
    setOpenSnackbar(false);
  };

  const labels = {
    1: "Useless",
    2: "Poor",
    3: "Acceptable",
    4: "Good",
    5: "Excellent",
  };

  // This will ensure the background fills the entire viewport
  React.useEffect(() => {
    document.body.style.backgroundColor = "#f0f0f9";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      {/* Apply the background color to the entire document */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#f0f0f9",
          zIndex: -1,
        }}
      />

      <Box
        component="main"
        sx={{
          backgroundColor: "#f0f0f9",
          flexGrow: 1,
          p: { xs: 3.5, md: 3.5 }, // Increased padding for larger screens
          transition: "margin-left 0.3s ease",
          pr: { md: 10 },

          marginLeft: {
            xs: 0,
            sm: `${props.drawerOpen ? 280 : 0}px`,
          },

          width: {
            xs: "100%",
            sm: `calc(100% - ${props.drawerOpen ? 280 : 0}px)`,
          },
          // minHeight: "100vh",
          marginTop: "50px", // Reduced top margin
          pb: 4, // Reduced bottom padding
        }}
      >
        <Box sx={{ pt: { xs: 1, md: 2 }, pb: { xs: 0.5, md: 1 } }}>
          {/* Empty title area with reduced padding */}
        </Box>

        <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
          {" "}
          {/* Reduced grid spacing */}
          {/* About Us Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)", // Lighter shadow
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                {" "}
                {/* Reduced padding */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  {" "}
                  {/* Reduced margin */}
                  <Avatar
                    sx={{ bgcolor: "#e3f2fd", mr: 1.5, width: 32, height: 32 }}
                  >
                    {" "}
                    {/* Smaller avatar */}
                    <InfoIcon
                      sx={{ color: "#1976d2", fontSize: "1.1rem" }}
                    />{" "}
                    {/* Smaller icon */}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.3rem" }, // Smaller font
                      fontWeight: 600,
                    }}
                  >
                    About Us
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    mb: 1.5,
                    fontSize: { xs: "0.85rem", md: "0.9rem" }, // Smaller font
                  }}
                >
                  {projectInfo.description}
                </Typography>
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", md: "0.85rem" }, // Smaller font
                      mb: 0.75,
                    }}
                  >
                    Key Features
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                    {" "}
                    {/* Smaller gap */}
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
                          mb: 0.6,
                          fontSize: { xs: "0.6rem", md: "0.7rem" }, // Smaller font
                          height: 22, // Smaller height
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", md: "0.85rem" }, // Smaller font
                      mb: 0.75,
                    }}
                  >
                    Technologies Used
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                    {" "}
                    {/* Smaller gap */}
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
                          mb: 0.6,
                          fontSize: { xs: "0.6rem", md: "0.7rem" }, // Smaller font
                          height: 22, // Smaller height
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} /> {/* Reduced margin */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }} // Smaller font
                >
                  This project was developed for the Human-Computer Interaction
                  course CS-5340 at Northeastern University.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Rate Us Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)", // Lighter shadow
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                {" "}
                {/* Reduced padding */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  {" "}
                  {/* Reduced margin */}
                  <Avatar
                    sx={{ bgcolor: "#fff8e1", mr: 1.5, width: 32, height: 32 }}
                  >
                    {" "}
                    {/* Smaller avatar */}
                    <FeedbackIcon
                      sx={{ color: "#f57f17", fontSize: "1.1rem" }}
                    />{" "}
                    {/* Smaller icon */}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.3rem" }, // Smaller font
                      fontWeight: 600,
                    }}
                  >
                    Rate Us
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }} // Smaller font
                >
                  We value your feedback! Let us know how we're doing and how we
                  can improve the GradGear Resources portal.
                </Typography>
                <form onSubmit={handleFeedbackSubmit}>
                  <Box
                    sx={{
                      mb: 2, // Reduced margin
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      component="legend"
                      sx={{
                        mb: 0.75, // Reduced margin
                        fontWeight: 500,
                        fontSize: { xs: "0.8rem", md: "0.85rem" }, // Smaller font
                      }}
                    >
                      How would you rate your experience?
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Rating
                        name="hover-feedback"
                        value={rating}
                        precision={1}
                        onChange={(event, newValue) => setRating(newValue)}
                        onChangeActive={(event, newHover) => setHover(newHover)}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                        size="small" // Smaller rating stars
                        sx={{ mr: 1.5 }} // Reduced margin
                      />
                      {rating !== null && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }} // Smaller font
                        >
                          {labels[hover !== -1 ? hover : rating]}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <FormControl
                    component="fieldset"
                    sx={{ mb: 2, width: "100%" }}
                  >
                    {" "}
                    {/* Reduced margin */}
                    <FormLabel
                      component="legend"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.8rem", md: "0.85rem" }, // Smaller font
                      }}
                    >
                      What type of feedback?
                    </FormLabel>
                    <RadioGroup
                      row={!isMobile}
                      aria-label="feedback-type"
                      name="feedback-type"
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                    >
                      <FormControlLabel
                        value="general"
                        control={<Radio size="small" />}
                        label={
                          <Typography
                            sx={{ fontSize: { xs: "0.8rem", md: "0.85rem" } }} // Smaller font
                          >
                            General
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="feature"
                        control={<Radio size="small" />}
                        label={
                          <Typography
                            sx={{ fontSize: { xs: "0.8rem", md: "0.85rem" } }} // Smaller font
                          >
                            Feature Request
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="bug"
                        control={<Radio size="small" />}
                        label={
                          <Typography
                            sx={{ fontSize: { xs: "0.8rem", md: "0.85rem" } }} // Smaller font
                          >
                            Bug Report
                          </Typography>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={isMobile ? 2 : 3} // Reduced rows
                    label="Your Feedback"
                    placeholder="Tell us what you think about our platform..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    sx={{ mb: 2 }} // Reduced margin
                    size="small" // Smaller text field
                    InputProps={{
                      style: {
                        fontSize: isMobile ? "0.8rem" : "0.85rem", // Smaller font
                      },
                    }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!rating}
                      endIcon={<SendIcon fontSize="small" />} // Smaller icon
                      sx={{
                        borderRadius: "6px",
                        fontSize: { xs: "0.75rem", md: "0.8rem" }, // Smaller font
                        py: 0.75, // Reduced padding
                        px: 1.5, // Reduced padding
                      }}
                      size="small" // Smaller button
                    >
                      Submit Feedback
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
          {/* Contact Us Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)", // Lighter shadow
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                {" "}
                {/* Reduced padding */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  {" "}
                  {/* Reduced margin */}
                  <Avatar
                    sx={{ bgcolor: "#e8f5e9", mr: 1.5, width: 32, height: 32 }}
                  >
                    {" "}
                    {/* Smaller avatar */}
                    <ContactSupportIcon
                      sx={{ color: "#2e7d32", fontSize: "1.1rem" }}
                    />{" "}
                    {/* Smaller icon */}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.3rem" }, // Smaller font
                      fontWeight: 600,
                    }}
                  >
                    Contact Us
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }} // Smaller font
                >
                  Have questions or need assistance? Reach out to our team and
                  we'll get back to you soon.
                </Typography>
                <form onSubmit={handleContactSubmit}>
                  <TextField
                    fullWidth
                    required
                    label="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    size="small" // Smaller text field
                    sx={{ mb: 1.5 }} // Reduced margin
                    InputProps={{
                      style: {
                        fontSize: isMobile ? "0.8rem" : "0.85rem", // Smaller font
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Email Address"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    size="small" // Smaller text field
                    sx={{ mb: 1.5 }} // Reduced margin
                    InputProps={{
                      style: {
                        fontSize: isMobile ? "0.8rem" : "0.85rem", // Smaller font
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Subject"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    size="small" // Smaller text field
                    sx={{ mb: 1.5 }} // Reduced margin
                    InputProps={{
                      style: {
                        fontSize: isMobile ? "0.8rem" : "0.85rem", // Smaller font
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={isMobile ? 2 : 3} // Reduced rows
                    label="Message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    sx={{ mb: 2 }} // Reduced margin
                    size="small" // Smaller text field
                    InputProps={{
                      style: {
                        fontSize: isMobile ? "0.8rem" : "0.85rem", // Smaller font
                      },
                    }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!contactMessage}
                      endIcon={<SendIcon fontSize="small" />} // Smaller icon
                      sx={{
                        borderRadius: "6px",
                        fontSize: { xs: "0.75rem", md: "0.8rem" }, // Smaller font
                        py: 0.75, // Reduced padding
                        px: 1.5, // Reduced padding
                      }}
                      size="small" // Smaller button
                    >
                      Send Message
                    </Button>
                  </Box>
                </form>
                <Divider sx={{ my: 2 }} /> {/* Reduced margin */}
                {/* Contact Info - Stacked on mobile */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: isMobile ? "flex-start" : "center",
                    mb: 1, // Reduced margin
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: isMobile ? 0.5 : 0, // Reduced margin
                    }}
                  >
                    <EmailIcon
                      fontSize="small"
                      sx={{
                        color: "primary.main",
                        mr: 0.75,
                        fontSize: "0.9rem",
                      }} // Smaller icon and margin
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }} // Smaller font
                    >
                      <Link
                        href="mailto:support@gradgear.edu"
                        underline="hover"
                      >
                        support@gradgear.edu
                      </Link>
                    </Typography>
                  </Box>

                  {!isMobile && (
                    <Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} /> // Reduced margin
                  )}

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon
                      fontSize="small"
                      sx={{
                        color: "primary.main",
                        mr: 0.75,
                        fontSize: "0.9rem",
                      }} // Smaller icon and margin
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.75rem", md: "0.8rem" }, // Smaller font
                        maxWidth: { xs: "85%", md: "100%" }, // Prevent overflow on mobile
                      }}
                    >
                      Northeastern University, 360 Huntington Ave, Boston, MA
                      02115
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notification */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: isMobile ? "center" : "left",
          }}
        >
          { isError ?
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
          : <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
          }
        </Snackbar>
      </Box>
    </>
  );
}

export default AboutUsData;
