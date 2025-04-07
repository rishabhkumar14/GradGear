import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Link,
  IconButton,
  Avatar,
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
import resourcesDataSet from "./ResourcesData.js";

// Import image
import laptopImg from "../../assets/laptop.png"; // Default image for laptops

// Enhanced resource data with more detailed descriptions
const resourcesData = resourcesDataSet;

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
  const [searchTerm, setSearchTerm] = React.useState("");
  const scrollContainerRefs = React.useRef({});
  const [visibleButtons, setVisibleButtons] = React.useState({});
  const [componentMounted, setComponentMounted] = React.useState(false);

  // Filter resources based on search term
  const filteredResources = React.useMemo(() => {
    if (!searchTerm.trim()) {
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
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
      if (filteredResources[category].length > 0) {
        // Always show right button if more than 2 items
        if (filteredResources[category].length > 2) {
          newVisibility[category] = { left: false, right: true };
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

  // Update button visibility when filtered resources change
  React.useEffect(() => {
    if (componentMounted) {
      // Wait for the DOM to update with new filtered resources
      const timer = setTimeout(() => {
        updateAllButtonVisibility();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [filteredResources, componentMounted]);

  // Update button visibility when drawer state changes
  React.useEffect(() => {
    if (componentMounted) {
      // Wait for layout to adjust after drawer toggle
      const timer = setTimeout(() => {
        updateAllButtonVisibility();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [props.drawerOpen, componentMounted]);

  // Handle scroll for a specific category
  const handleScroll = (category, direction) => {
    const container = scrollContainerRefs.current[category];
    if (container) {
      // For 2.5 cards per view with width of 480px each
      const scrollAmount = 480;
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
    const showRightButton = categoryItems.length > 2;

    return (
      <Box sx={{ position: "relative", mt: 2, mb: 2 }}>
        {/* Left scroll button */}
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

        {/* Cards container */}
        <Box
          ref={(el) => (scrollContainerRefs.current[category] = el)}
          onScroll={() => handleContainerScroll(category)}
          sx={{
            display: "flex",
            overflowX: "hidden",
            gap: 3,
            pb: 1,
            pt: 1,
            scrollBehavior: "smooth",
          }}
        >
          {categoryItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                width: 480, // Widened for 2.5 cards view
                minWidth: 480, // Widened for 2.5 cards view
                minHeight: 180,
                display: "flex",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
                cursor:
                  item.navigateTo && item.navigateTo !== "#"
                    ? "pointer"
                    : "default",
                borderRadius: "8px", // Match border radius with filter component
                overflow: "hidden", // Ensure the border radius works with image
              }}
              onClick={() => handleCardClick(item.navigateTo)}
            >
              {/* Left side - Image */}
              <Box
                sx={{
                  width: 160,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image || laptopImg}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center", // Center the image
                  }}
                />
              </Box>

              {/* Right side - Content */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  width: "calc(100% - 160px)",
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
                    fontSize: "0.65rem", // Reduced from 0.7rem
                  }}
                >
                  {item.description}
                </Typography>

                {/* Chips */}
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}
                >
                  {item.chips &&
                    item.chips.map((chip, index) => {
                      const chipColor = getChipColor(index);
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
                {item.locations && (
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
                    mt: "auto",
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
                        height: "24px", // Fixed height for consistency
                        fontSize: "0.7rem",
                        fontWeight: "medium",
                        borderRadius: "6px", // Match border radius
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
                      height: "24px", // Fixed height for consistency
                      fontSize: "0.7rem",
                      fontWeight: "medium",
                      borderRadius: "6px", // Match border radius
                    }}
                  >
                    Navigate
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Right scroll button - always show for categories with more than 2 items */}
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
      </Box>
    );
  };

  // Category colors for the headers
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "spaces":
        return "#616161"; // Grey
      case "lockers":
        return "#616161";
      case "charger":
        return "#616161";
      case "laptop":
        return "#616161";
      case "accessories":
        return "#616161";
      case "camera":
        return "#616161";
      case "vending accessories":
        return "#616161";
      case "working with gpus":
        return "#616161";
      default:
        return "#616161";
    }
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
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: "1.8rem" }}
        >
          Resources
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse resources by category. Access technology, spaces, and tools to
          support your work.
        </Typography>

        {/* Search Bar - Reduced padding and height */}
        <Paper
          sx={{
            p: 1, // Reduced padding
            mb: 4,
            display: "flex",
            alignItems: "center",
            borderRadius: "8px", // Match border radius
          }}
        >
          <TextField
            fullWidth
            placeholder="Search resources by name, description, or tag..."
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px", // Match border radius
                // Reduce input field height
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.15)",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px", // Smaller input padding
              },
            }}
            size="small" // Use small size for TextField
          />
          {/* Smaller filter button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<FilterListIcon />}
            sx={{
              ml: 2,
              py: 0.75,
              px: 1.5,
              minWidth: "auto",
              borderRadius: "6px", // Match border radius
            }}
          >
            Filter
          </Button>
        </Paper>
      </Box>

      {/* Display each category */}
      {Object.keys(filteredResources).length > 0 ? (
        Object.keys(filteredResources).map((category) => (
          <Box key={category} sx={{ mb: 4 }}>
            {/* Enhanced category header with icon and count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${getCategoryColor(category)}`,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: getCategoryColor(category),
                  mr: 1.5,
                  width: 36,
                  height: 36,
                }}
              >
                {getCategoryIcon(category)}
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "1.4rem",
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
                  sx={{ fontSize: "0.75rem" }}
                >
                  {filteredResources[category].length} items available
                </Typography>
              </Box>
            </Box>
            {renderResourceCards(filteredResources[category], category)}
          </Box>
        ))
      ) : (
        <Paper sx={{ p: 4, borderRadius: "8px", textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No resources found matching your search. Try different keywords.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Resources;
