import * as React from "react";
import {
  Box,
  Typography,
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
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CategoryIcon from "@mui/icons-material/Category";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { resourcesApi } from "../../services/api";

function Contribute(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = React.useRef(null);

  // Resource submission form state
  const [resourceName, setResourceName] = React.useState("");
  const [resourceCategory, setResourceCategory] = React.useState("");
  const [resourceDescription, setResourceDescription] = React.useState("");
  const [resourceLink, setResourceLink] = React.useState("");
  const [resourceTags, setResourceTags] = React.useState([]);
  const [currentTag, setCurrentTag] = React.useState("");
  const [imageFile, setImageFile] = React.useState(null);

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
  const [isError, setIsError] = React.useState(false);


  // Addition :
  const [isLoading,setIsLoading] = React.useState(false);
  const [categoryListData,setCategoryListData] = React.useState([]);

   // Fetch categories from API
   React.useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await resourcesApi.getAllCategories();
        const formattedData = formatCategoryResData(data)
        setCategoryListData(formattedData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoryListData([
          { id: 1, name: "spaces" },
          { id: 2, name: "lockers" },
          { id: 3, name: "charger" },
          { id: 4, name: "laptop" },
          { id: 5, name: "accessories" },
          { id: 6, name: "camera" },
          { id: 7, name: "vending accessories" },
          { id: 8, name: "working with gpus" },
          { id: 9, name: "other" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);
  
  
  const formatCategoryResData = (data) => {
    const result = [];
    let cnt = 1;
  
    data.forEach((category) => {
      result.push({ id: cnt, name: category });
      cnt++;
    });
  
    console.log(result);
    return result;
  };

  // Sample categories for the dropdown
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

  // Form validation
  const validateResourceForm = () => {
    const newErrors = {};
    if (!resourceName.trim()) newErrors.name = "Name is required";
    if (!resourceCategory) newErrors.category = "Category is required";
    if (!resourceDescription.trim())
      newErrors.description = "Description is required";
    if (resourceLink && !/^https?:\/\//.test(resourceLink))
      newErrors.link =
        "Please enter a valid URL starting with http:// or https://";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCategoryForm = () => {
    const newErrors = {};
    if (!categoryName.trim())
      newErrors.categoryName = "Category name is required";
    if (!categoryDescription.trim())
      newErrors.categoryDescription = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handlers
  const handleResourceSubmit = (event) => {
    event.preventDefault();

    if (!validateResourceForm()) return;

    // Form data would be sent to backend here
    console.log({
      type: "resource",
      name: resourceName,
      category: resourceCategory,
      description: resourceDescription,
      link: resourceLink,
      tags: resourceTags,
      image: imageFile ? imageFile.name : null,
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

    if (!validateCategoryForm()) return;

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

  // Form reset functions
  const resetResourceForm = () => {
    setResourceName("");
    setResourceCategory("");
    setResourceDescription("");
    setResourceLink("");
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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
          // minHeight removed to avoid scrollbar
          marginTop: "50px",
          pb: 4,
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Left Column: Information and Category Suggestion */}
          <Grid item xs={12} md={5}>
            {/* Information Card - Simplified */}
            <Card
              sx={{
                borderRadius: "8px",
                bgcolor: "#f8f9ff",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                mb: { xs: 2, md: 3 },
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    fontWeight: 600,
                  }}
                >
                  <HelpOutlineIcon
                    sx={{
                      mr: 1,
                      color: "primary.main",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                    }}
                  />
                  How it Works
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", md: "0.85rem" }, mb: 1 }}
                >
                  Your suggestions help us improve the resources available to
                  the community. We'll review your submission within 1-2 days
                  and notify you when it's approved.
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                  }}
                >
                  Thank you for helping to make campus resources more accessible
                  to everyone!
                </Typography>
              </CardContent>
            </Card>

            {/* Category Suggestion Form */}
            <Card
              sx={{
                // height: "100%",
                borderRadius: "8px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Avatar
                    sx={{ bgcolor: "#fff8e1", mr: 1.5, width: 32, height: 32 }}
                  >
                    <CategoryIcon
                      sx={{ color: "#f57f17", fontSize: "1.1rem" }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                      fontWeight: 600,
                    }}
                  >
                    Suggest a Category
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    mb: 2,
                  }}
                >
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
                    margin="dense"
                    sx={{
                      my: 0.5,
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.8rem", md: "0.85rem" },
                      },
                    }}
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
                    margin="dense"
                    sx={{
                      my: 0.5,
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.8rem", md: "0.85rem" },
                      },
                    }}
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
                    margin="dense"
                    sx={{
                      my: 0.5,
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.8rem", md: "0.85rem" },
                      },
                    }}
                  />

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={resetCategoryForm}
                      sx={{
                        mr: 1,
                        borderRadius: "6px",
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        py: 0.75,
                        px: 1.5,
                      }}
                      size="small"
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon fontSize="small" />}
                      sx={{
                        borderRadius: "6px",
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        py: 0.75,
                        px: 1.5,
                      }}
                      size="small"
                    >
                      Submit Category
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Resource Suggestion Form */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Avatar
                    sx={{ bgcolor: "#e3f2fd", mr: 1.5, width: 32, height: 32 }}
                  >
                    <FolderOpenIcon
                      sx={{ color: "#1976d2", fontSize: "1.1rem" }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                      fontWeight: 600,
                    }}
                  >
                    Suggest a Resource
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    mb: 2,
                  }}
                >
                  Found a helpful resource that's not listed? Let us know about
                  it so we can add it to our catalog.
                </Typography>

                <form onSubmit={handleResourceSubmit}>
                  <Grid container spacing={{ xs: 1, md: 2 }}>
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
                        margin="dense"
                        sx={{
                          my: 0.5,
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl
                        required
                        fullWidth
                        error={!!errors.category}
                        size="small"
                        margin="dense"
                        sx={{ my: 0.5 }}
                      >
                        <InputLabel
                          id="category-label"
                          sx={{
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          }}
                        >
                          Category
                        </InputLabel>
                        <Select
                          labelId="category-label"
                          label="Category"
                          value={resourceCategory}
                          onChange={(e) => setResourceCategory(e.target.value)}
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: { xs: "0.8rem", md: "0.85rem" },
                            },
                          }}
                        >
                          {!isLoading && categoryListData.map((category) => (
                            <MenuItem
                              key={category.id}
                              value={category.id}
                              sx={{ fontSize: { xs: "0.8rem", md: "0.85rem" } }}
                            >
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
                        placeholder="Describe the resource and include any location information if relevant"
                        value={resourceDescription}
                        onChange={(e) => setResourceDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        size="small"
                        margin="dense"
                        sx={{
                          my: 0.5,
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          },
                        }}
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
                              <LinkIcon
                                fontSize="small"
                                sx={{ fontSize: "0.9rem" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        size="small"
                        margin="dense"
                        sx={{
                          my: 0.5,
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          },
                        }}
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
                          startAdornment:
                            resourceTags.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  mr: 1,
                                  maxWidth: "60%",
                                }}
                              >
                                {resourceTags.map((tag, index) => (
                                  <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                    size="small"
                                    sx={{
                                      height: 22,
                                      fontSize: { xs: "0.65rem", md: "0.7rem" },
                                      "& .MuiChip-deleteIcon": {
                                        fontSize: "0.9rem",
                                      },
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : null,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleAddTag}
                                disabled={!currentTag.trim()}
                                edge="end"
                                size="small"
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        size="small"
                        margin="dense"
                        sx={{
                          my: 0.5,
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: "1px dashed rgba(0, 0, 0, 0.23)",
                          borderRadius: "4px",
                          p: { xs: 1.5, md: 2 },
                          textAlign: "center",
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                          cursor: "pointer",
                          "&:hover": { borderColor: "primary.main" },
                          my: 1,
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
                          sx={{
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            color: "text.secondary",
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.75rem", md: "0.8rem" },
                          }}
                        >
                          {imageFile
                            ? `Selected: ${imageFile.name}`
                            : "Click to upload an image of the resource"}
                        </Typography>
                        {errors.image && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{
                              fontSize: { xs: "0.7rem", md: "0.75rem" },
                            }}
                          >
                            {errors.image}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={resetResourceForm}
                        sx={{
                          mr: 1,
                          borderRadius: "6px",
                          fontSize: { xs: "0.75rem", md: "0.8rem" },
                          py: 0.75,
                          px: 1.5,
                        }}
                        size="small"
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon fontSize="small" />}
                        sx={{
                          borderRadius: "6px",
                          fontSize: { xs: "0.75rem", md: "0.8rem" },
                          py: 0.75,
                          px: 1.5,
                        }}
                        size="small"
                      >
                        Submit Resource
                      </Button>
                    </Grid>
                  </Grid>
                </form>
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

export default Contribute;
