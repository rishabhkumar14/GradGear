import * as React from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Link,
  IconButton,
  Avatar,
  Collapse,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import LaptopIcon from "@mui/icons-material/Laptop";
import BuildIcon from "@mui/icons-material/Build";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MemoryIcon from "@mui/icons-material/Memory";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Import API service
import { resourcesApi } from "../../services/api";

// Default image for resources
import imgNotFound from "../../assets/imgNotFound.png";

// Get category icon based on category name
const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case "spaces":
      return <MeetingRoomIcon />;
    case "lockers":
      return <LockIcon />;
    case "charger":
      return <BatteryChargingFullIcon />;
    case "laptop":
      return <LaptopIcon />;
    case "accessories":
      return <BuildIcon />;
    case "camera":
      return <PhotoCameraIcon />;
    case "vending accessories":
      return <StorefrontIcon />;
    case "working with gpus":
      return <MemoryIcon />;
    default:
      return null;
  }
};

// Generate random colors for chips
const chipColors = [
  { bg: "#e3f2fd", text: "#1565c0" }, // Blue
  { bg: "#e8f5e9", text: "#2e7d32" }, // Green
  { bg: "#fff8e1", text: "#f57f17" }, // Amber
  { bg: "#f3e5f5", text: "#7b1fa2" }, // Purple
  { bg: "#fbe9e7", text: "#d84315" }, // Deep Orange
  { bg: "#e0f7fa", text: "#00838f" }, // Cyan
];

function Resources(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State
  const [searchTerm, setSearchTerm] = React.useState("");
  const [resourcesData, setResourcesData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const scrollContainerRefs = React.useRef({});
  const [visibleButtons, setVisibleButtons] = React.useState({});
  const [componentMounted, setComponentMounted] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState({});

  // Fetch resources from API
  React.useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await resourcesApi.getAllResources();
        setResourcesData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Initialize expanded state for all categories
  React.useEffect(() => {
    if (Object.keys(resourcesData).length > 0) {
      const initialExpandedState = {};
      Object.keys(resourcesData).forEach((category) => {
        initialExpandedState[category] = !isMobile; // Collapse categories on mobile by default
      });
      setExpandedCategories(initialExpandedState);
    }
  }, [resourcesData, isMobile]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter resources based on search term
  const filteredResources = React.useMemo(() => {
    if (!searchTerm.trim() || Object.keys(resourcesData).length === 0) {
      return resourcesData;
    }

    const term = searchTerm.toLowerCase();
    const filtered = {};

    Object.keys(resourcesData).forEach((category) => {
      const filteredItems = resourcesData[category].filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.chips &&
            item.chips.some((chip) => chip.toLowerCase().includes(term)))
      );

      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });

    return filtered;
  }, [searchTerm, resourcesData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // No need to do anything else as the filteredResources will update automatically
  };

  // Check if a category's container can scroll
  const checkScrollability = (category) => {
    const container = scrollContainerRefs.current[category];
    if (!container) return { left: false, right: false };

    return {
      left: container.scrollLeft > 10,
      right: container.scrollWidth > container.clientWidth + 10,
    };
  };

  // Function to update button visibility for all categories
  const updateAllButtonVisibility = () => {
    const newVisibility = {};

    Object.keys(filteredResources).forEach((category) => {
      if (
        filteredResources[category].length > 0 &&
        expandedCategories[category]
      ) {
        // Always show right button if more than 2 items
        if (filteredResources[category].length > 2) {
          newVisibility[category] = { left: false, right: !isMobile };
        } else {
          newVisibility[category] = checkScrollability(category);
        }
      }
    });

    setVisibleButtons(newVisibility);
  };

  // Initialize visibility of navigation buttons after component mount
  React.useEffect(() => {
    // Set componentMounted to true to indicate initial rendering is complete
    setComponentMounted(true);

    // Run multiple checks with increasing delays to ensure DOM is fully rendered
    const timers = [
      setTimeout(() => updateAllButtonVisibility(), 100),
      setTimeout(() => updateAllButtonVisibility(), 300),
      setTimeout(() => updateAllButtonVisibility(), 600),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  // Update button visibility when filtered resources or expanded states change
  React.useEffect(() => {
    if (componentMounted) {
      // Wait for the DOM to update
      const timer = setTimeout(() => {
        updateAllButtonVisibility();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [filteredResources, expandedCategories, componentMounted]);

  // Update button visibility when drawer state changes
  React.useEffect(() => {
    if (componentMounted) {
      // Wait for layout to adjust after drawer toggle
      const timer = setTimeout(() => {
        updateAllButtonVisibility();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [props.drawerOpen, componentMounted, isMobile]);

  // Handle scroll for a specific category
  const handleScroll = (category, direction) => {
    const container = scrollContainerRefs.current[category];
    if (container) {
      // Adjust scroll amount based on screen size
      const scrollAmount = isMobile ? 300 : 480;
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }

      // Update button visibility after scroll
      setTimeout(() => {
        setVisibleButtons((prev) => ({
          ...prev,
          [category]: checkScrollability(category),
        }));
      }, 300);
    }
  };

  // Get color for a chip
  const getChipColor = (index) => {
    return chipColors[index % chipColors.length];
  };

  // Function to handle container scroll events
  const handleContainerScroll = (category) => {
    setVisibleButtons((prev) => ({
      ...prev,
      [category]: checkScrollability(category),
    }));
  };

  // Function to handle card click
  const handleCardClick = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
    }
  };

  // Function to render resource cards for a category
  const renderResourceCards = (categoryItems, category) => {
    // Always show right button if there are more than 2 items
    const showRightButton = categoryItems.length > 2 && !isMobile;

    return (
      <Box sx={{ position: "relative", mt: 2, mb: 2 }}>
        {/* Left scroll button - hidden on mobile */}
        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => handleScroll(category, "left")}
            sx={{
              position: "absolute",
              left: -30,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              color: "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                color: "rgba(0, 0, 0, 0.8)",
              },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: visibleButtons[category]?.left ? "flex" : "none",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}

        {/* Cards container */}
        <Box
          ref={(el) => (scrollContainerRefs.current[category] = el)}
          onScroll={() => handleContainerScroll(category)}
          sx={{
            display: "flex",
            overflowX: "auto", // Changed to auto for mobile swiping
            gap: { xs: 2, sm: 3 },
            pb: 1,
            pt: 1,
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
            msOverflowStyle: "none", // Hide scrollbar in Edge
            scrollbarWidth: "none", // Hide scrollbar in Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar in Chrome/Safari
            },
          }}
        >
          {categoryItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                width: { xs: "85vw", sm: 480 }, // Responsive width
                minWidth: { xs: "85vw", sm: 480 }, // Responsive min-width
                minHeight: 180,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, side by side on desktop
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
                cursor:
                  item.navigateTo && item.navigateTo !== "#"
                    ? "pointer"
                    : "default",
                borderRadius: "8px",
                overflow: "hidden",
              }}
              onClick={() => handleCardClick(item.navigateTo)}
            >
              {/* Image - top on mobile, left on desktop */}
              <Box
                sx={{
                  width: { xs: "100%", sm: 160 },
                  height: { xs: 140, sm: "auto" },
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image || imgNotFound}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  onError={(e) => {
                    e.target.src = imgNotFound; // Fallback to local image if API image fails
                  }}
                />
              </Box>

              {/* Content - below image on mobile, right of image on desktop */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  width: { xs: "100%", sm: "calc(100% - 160px)" },
                  flex: 1,
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    fontSize: "0.65rem",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 2, sm: "unset" }, // Limit to 2 lines on mobile
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </Typography>

                {/* Chips */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    mb: 1,
                    mt: { xs: "auto", sm: 0 }, // Push to bottom on mobile
                  }}
                >
                  {item.chips &&
                    item.chips.map((chip, index) => {
                      const chipColor = getChipColor(index);
                      // Only show first 2 chips on mobile
                      if (isMobile && index >= 2) return null;
                      return (
                        <Chip
                          key={index}
                          label={chip}
                          size="small"
                          sx={{
                            backgroundColor: chipColor.bg,
                            color: chipColor.text,
                            fontWeight: 500,
                            height: "20px",
                            fontSize: "0.65rem",
                          }}
                        />
                      );
                    })}

                  {item.duration && (
                    <Chip
                      label={item.duration}
                      size="small"
                      sx={{
                        backgroundColor: "#ede7f6",
                        color: "#5e35b1",
                        fontWeight: 500,
                        height: "20px",
                        fontSize: "0.65rem",
                      }}
                    />
                  )}
                </Box>

                {/* Locations if any - truncated with tooltip */}
                {item.locations && !isMobile && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    >
                      <LocationOnIcon
                        fontSize="small"
                        sx={{ mr: 0.5, fontSize: "0.9rem" }}
                      />
                      {item.locations.length > 1
                        ? `Multiple locations (${item.locations.length})`
                        : item.locations[0]}
                    </Typography>
                  </Box>
                )}

                {/* Action buttons */}
                <Box
                  sx={{
                    mt: { xs: 1, sm: "auto" },
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
                >
                  {item.hasViewStatus && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      sx={{
                        py: 0.25,
                        minHeight: "24px",
                        height: "24px",
                        fontSize: "0.7rem",
                        fontWeight: "medium",
                        borderRadius: "6px",
                      }}
                    >
                      View Status
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<LinkIcon sx={{ fontSize: "0.9rem" }} />}
                    component={Link}
                    href={item.navigateTo}
                    target="_blank"
                    sx={{
                      py: 0.25,
                      minHeight: "24px",
                      height: "24px",
                      fontSize: "0.7rem",
                      fontWeight: "medium",
                      borderRadius: "6px",
                    }}
                  >
                    Navigate
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Right scroll button - hidden on mobile */}
        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => handleScroll(category, "right")}
            sx={{
              position: "absolute",
              right: -30,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              color: "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                color: "rgba(0, 0, 0, 0.8)",
              },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display:
                visibleButtons[category]?.right || showRightButton
                  ? "flex"
                  : "none",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  };

  // Category colors for the headers
  const getCategoryColor = (category) => {
    return "#616161"; // Grey for all categories
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "#f0f0f9",
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
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
      }}
    >
      <Box sx={{ pt: { xs: 2, sm: 4 }, pb: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" } }}
        >
          Resources
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            display: { xs: "none", sm: "block" }, // Hide on mobile to save space
          }}
        >
          Browse resources by category. Access technology, spaces, and tools to
          support your work.
        </Typography>

        {/* Search Bar - Responsive */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: { xs: 0.75, sm: 1 },
            mb: { xs: 2, sm: 4 },
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
            flexDirection: { xs: "column", sm: "row" }, // Stack on mobile
          }}
        >
          <TextField
            fullWidth
            placeholder={
              isMobile
                ? "Search resources..."
                : "Search resources by name, description, or tag..."
            }
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.15)",
                },
              },
              "& .MuiInputBase-input": {
                padding: { xs: "8px 10px", sm: "10px 14px" },
              },
            }}
            size="small"
          />

          {/* Filter button - full width on mobile */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            // startIcon={<FilterListIcon />}
            sx={{
              ml: { xs: 0, sm: 2 },
              mt: { xs: 1, sm: 0 },
              py: 0.75,
              px: 1.5,
              minWidth: "auto",
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
              borderRadius: "6px",
            }}
          >
            Search
          </Button>
        </Paper>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Paper
          sx={{ p: { xs: 2, sm: 4 }, borderRadius: "8px", textAlign: "center" }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
          <Typography
            variant="h6"
            color="error"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Paper>
      )}

      {/* Display each category */}
      {!loading && !error && Object.keys(filteredResources).length > 0
        ? Object.keys(filteredResources).map((category) => (
            <Box key={category} sx={{ mb: { xs: 2, sm: 4 } }}>
              {/* Enhanced category header with icon and count */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: expandedCategories[category] ? { xs: 1, sm: 2 } : 0,
                  pb: 1,
                  borderBottom: `2px solid ${getCategoryColor(category)}`,
                  cursor: "pointer",
                  userSelect: "none",
                  // Mobile padding adjustments
                  px: { xs: 0.5, sm: 0 },
                }}
                onClick={() => toggleCategory(category)}
              >
                <Avatar
                  sx={{
                    bgcolor: getCategoryColor(category),
                    mr: 1.5,
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  {getCategoryIcon(category)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: { xs: "1.1rem", sm: "1.4rem" },
                      fontWeight: 600,
                      color: getCategoryColor(category),
                      lineHeight: 1.2,
                    }}
                  >
                    {category}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                  >
                    {filteredResources[category].length} items available
                  </Typography>
                </Box>
                {/* Expand/Collapse Icon */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category);
                  }}
                  sx={{
                    color: getCategoryColor(category),
                  }}
                >
                  {expandedCategories[category] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>

              {/* Collapsible content */}
              <Collapse
                in={expandedCategories[category]}
                timeout="auto"
                unmountOnExit
              >
                {renderResourceCards(filteredResources[category], category)}
              </Collapse>
            </Box>
          ))
        : !loading &&
          !error && (
            <Paper
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                No resources found matching your search. Try different keywords.
              </Typography>
            </Paper>
          )}
    </Box>
  );
}

export default Resources;
