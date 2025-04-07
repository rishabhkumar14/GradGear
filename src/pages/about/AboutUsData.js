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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

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

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();
    console.log({
      rating,
      feedbackType,
      feedbackText,
    });

    setSnackbarMessage("Thank you for your feedback!");
    setOpenSnackbar(true);

    // Reset form
    setRating(0);
    setFeedbackType("general");
    setFeedbackText("");
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    console.log({
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      message: contactMessage,
    });

    setSnackbarMessage(
      "Your message has been sent. We'll get back to you soon!"
    );
    setOpenSnackbar(true);

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
    setOpenSnackbar(false);
  };

  const labels = {
    1: "Useless",
    2: "Poor",
    3: "Acceptable",
    4: "Good",
    5: "Excellent",
  };

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
        {/* <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: "1.8rem" }}
        >
          About RetailHub
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Learn about our project, provide feedback, or get in touch with our
          team.
        </Typography> */}
      </Box>

      <Grid container spacing={3}>
        {/* About Us Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#e3f2fd", mr: 1.5 }}>
                  <InfoIcon sx={{ color: "#1976d2" }} />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontSize: "1.4rem", fontWeight: 600 }}
                >
                  About Us
                </Typography>
              </Box>

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
                        mb: 0.8,
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
                        mb: 0.8,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#fff8e1", mr: 1.5 }}>
                  <FeedbackIcon sx={{ color: "#f57f17" }} />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontSize: "1.4rem", fontWeight: 600 }}
                >
                  Rate Us
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                We value your feedback! Let us know how we're doing and how we
                can improve the RetailHub Resources portal.
              </Typography>

              <form onSubmit={handleFeedbackSubmit}>
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    component="legend"
                    sx={{ mb: 1, fontWeight: 500 }}
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
                      size="large"
                      sx={{ mr: 2 }}
                    />
                    {rating !== null && (
                      <Typography variant="body2" color="text.secondary">
                        {labels[hover !== -1 ? hover : rating]}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 500 }}>
                    What type of feedback?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="feedback-type"
                    name="feedback-type"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                  >
                    <FormControlLabel
                      value="general"
                      control={<Radio />}
                      label="General"
                    />
                    <FormControlLabel
                      value="feature"
                      control={<Radio />}
                      label="Feature Request"
                    />
                    <FormControlLabel
                      value="bug"
                      control={<Radio />}
                      label="Bug Report"
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Feedback"
                  placeholder="Tell us what you think about our platform..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!rating}
                    endIcon={<SendIcon />}
                    sx={{ borderRadius: "6px" }}
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#e8f5e9", mr: 1.5 }}>
                  <ContactSupportIcon sx={{ color: "#2e7d32" }} />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontSize: "1.4rem", fontWeight: 600 }}
                >
                  Contact Us
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
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
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  required
                  label="Subject"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!contactMessage}
                    endIcon={<SendIcon />}
                    sx={{ borderRadius: "6px" }}
                  >
                    Send Message
                  </Button>
                </Box>
              </form>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon
                  fontSize="small"
                  sx={{ color: "primary.main", mr: 1 }}
                />
                <Typography variant="body2">
                  <Link href="mailto:support@retailhub.edu" underline="hover">
                    support@retailhub.edu
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon
                  fontSize="small"
                  sx={{ color: "primary.main", mr: 1 }}
                />
                <Typography variant="body2">
                  Northeastern University, 360 Huntington Ave, Boston, MA 02115
                </Typography>
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
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AboutUsData;
