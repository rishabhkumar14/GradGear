import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Snackbar,
  Alert,
  InputAdornment,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CategoryIcon from "@mui/icons-material/Category";

// Sample categories
const categories = [
  { id: 1, name: "spaces" },
  { id: 2, name: "lockers" },
  { id: 3, name: "charger" },
  { id: 4, name: "laptop" },
  { id: 5, name: "accessories" },
  { id: 6, name: "camera" },
  { id: 7, name: "vending accessories" },
  { id: 8, name: "working with gpus" },
  { id: 9, name: "other" },
];

function ContributeData(props) {
  // Resource submission form state
  const [resourceName, setResourceName] = React.useState("");
  const [resourceCategory, setResourceCategory] = React.useState("");
  const [resourceDescription, setResourceDescription] = React.useState("");
  const [resourceLink, setResourceLink] = React.useState("");
  const [resourceLocation, setResourceLocation] = React.useState("");
  const [resourceTags, setResourceTags] = React.useState([]);
  const [currentTag, setCurrentTag] = React.useState("");
  const [imageFile, setImageFile] = React.useState(null);
  const fileInputRef = React.useRef(null);

  // Category suggestion form state
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");
  const [categorySuggestion, setCategorySuggestion] = React.useState("");

  // Form validation state
  const [errors, setErrors] = React.useState({});

  // Notification state
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  // Handle tag input
  const handleTagChange = (event) => {
    setCurrentTag(event.target.value);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !resourceTags.includes(currentTag.trim())) {
      setResourceTags([...resourceTags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setResourceTags(resourceTags.filter((tag) => tag !== tagToDelete));
  };

  // Handle file upload
  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Check if file is an image
      if (!file.type.match("image.*")) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "File size should be less than 5MB" });
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, image: null });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Form submission handlers
  const handleResourceSubmit = (event) => {
    event.preventDefault();

    // Validate form
    const newErrors = {};
    if (!resourceName.trim()) newErrors.name = "Name is required";
    if (!resourceCategory) newErrors.category = "Category is required";
    if (!resourceDescription.trim())
      newErrors.description = "Description is required";
    if (resourceLink && !isValidUrl(resourceLink))
      newErrors.link = "Please enter a valid URL";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Form data would be sent to backend here
    console.log({
      type: "resource",
      name: resourceName,
      category: resourceCategory,
      description: resourceDescription,
      link: resourceLink,
      location: resourceLocation,
      tags: resourceTags,
      image: imageFile,
    });

    // Show success message
    setSnackbarSeverity("success");
    setSnackbarMessage("Resource suggestion submitted successfully!");
    setOpenSnackbar(true);

    // Reset form
    resetResourceForm();
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();

    // Validate form
    const newErrors = {};
    if (!categoryName.trim())
      newErrors.categoryName = "Category name is required";
    if (!categoryDescription.trim())
      newErrors.categoryDescription = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Form data would be sent to backend here
    console.log({
      type: "category",
      name: categoryName,
      description: categoryDescription,
      suggestion: categorySuggestion,
    });

    // Show success message
    setSnackbarSeverity("success");
    setSnackbarMessage("Category suggestion submitted successfully!");
    setOpenSnackbar(true);

    // Reset form
    resetCategoryForm();
  };

  // Helper functions
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const resetResourceForm = () => {
    setResourceName("");
    setResourceCategory("");
    setResourceDescription("");
    setResourceLink("");
    setResourceLocation("");
    setResourceTags([]);
    setImageFile(null);
    setErrors({});
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setCategorySuggestion("");
    setErrors({});
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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
      {/* <Box sx={{ pt: 4, pb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: "1.8rem" }}
        >
          Contribute
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Help improve the resource catalog by suggesting new resources or
          categories.
        </Typography>
      </Box> */}

      <Grid container spacing={3}>
        {/* Resource Suggestion Form */}
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "8px",
              mb: { xs: 3, md: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FolderOpenIcon color="primary" sx={{ mr: 1.5 }} />
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: 600,
                }}
              >
                Suggest a Resource
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Found a helpful resource that's not listed? Let us know about it
              so we can add it to our catalog.
            </Typography>

            <form onSubmit={handleResourceSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    fullWidth
                    label="Resource Name"
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    size="small"
                    margin="normal"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    required
                    fullWidth
                    error={!!errors.category}
                    size="small"
                    margin="normal"
                    sx={{ mt: 1 }}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={resourceCategory}
                      onChange={(e) => setResourceCategory(e.target.value)}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    size="small"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Resource URL"
                    placeholder="https://example.com"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    error={!!errors.link}
                    helperText={errors.link}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    placeholder="Where can this resource be found?"
                    value={resourceLocation}
                    onChange={(e) => setResourceLocation(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tags"
                    placeholder="Add tags and press Enter"
                    value={currentTag}
                    onChange={handleTagChange}
                    onKeyDown={handleTagKeyDown}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddTag}
                            disabled={!currentTag.trim()}
                            edge="end"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                    margin="normal"
                  />
                  {resourceTags.length > 0 && (
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {resourceTags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          size="small"
                          sx={{
                            borderRadius: "6px",
                            height: "24px",
                            fontSize: "0.7rem",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: "1px dashed rgba(0, 0, 0, 0.23)",
                      borderRadius: "4px",
                      p: 2,
                      textAlign: "center",
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                      cursor: "pointer",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                    onClick={handleBrowseClick}
                  >
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      type="file"
                      hidden
                      onChange={handleFileSelect}
                    />
                    <ImageIcon
                      sx={{ fontSize: "2rem", color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {imageFile
                        ? `Selected: ${imageFile.name}`
                        : "Click to upload an image of the resource"}
                    </Typography>
                    {errors.image && (
                      <Typography color="error" variant="caption">
                        {errors.image}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    sx={{ mr: 1, borderRadius: "6px" }}
                    onClick={resetResourceForm}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    sx={{ borderRadius: "6px" }}
                  >
                    Submit Resource
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Category Suggestion and Information */}
        <Grid item xs={12} md={5}>
          {/* Category Suggestion Form */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "8px",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CategoryIcon color="primary" sx={{ mr: 1.5 }} />
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: 600,
                }}
              >
                Suggest a Category
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Have an idea for a new resource category? Let us know what you
              think should be included.
            </Typography>

            <form onSubmit={handleCategorySubmit}>
              <TextField
                required
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                error={!!errors.categoryName}
                helperText={errors.categoryName}
                size="small"
                margin="normal"
                sx={{ mt: 1 }}
              />

              <TextField
                required
                fullWidth
                multiline
                rows={2}
                label="Description"
                placeholder="What types of resources would be included in this category?"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                error={!!errors.categoryDescription}
                helperText={errors.categoryDescription}
                size="small"
                margin="normal"
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Additional Notes"
                placeholder="Any other details about your suggestion..."
                value={categorySuggestion}
                onChange={(e) => setCategorySuggestion(e.target.value)}
                size="small"
                margin="normal"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  sx={{ mr: 1, borderRadius: "6px" }}
                  onClick={resetCategoryForm}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  sx={{ borderRadius: "6px" }}
                >
                  Submit Category
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Information Card */}
          <Card sx={{ borderRadius: "8px", bgcolor: "#f8f9ff" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HelpOutlineIcon sx={{ mr: 1, color: "primary.main" }} />
                How it Works
              </Typography>

              <Typography variant="body2" paragraph>
                Your suggestions help us improve the resources available to the
                Northeastern community. Here's what happens after you submit:
              </Typography>

              <ol style={{ paddingLeft: "1.5rem", margin: "0.5rem 0" }}>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Our team reviews your submission (typically within 1-2
                    business days)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    We verify the details and location of the resource
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    The resource is added to our database and made available to
                    everyone
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    You'll receive email notification when your submission is
                    approved
                  </Typography>
                </li>
              </ol>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Thank you for helping to make campus resources more accessible
                to everyone!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContributeData;
