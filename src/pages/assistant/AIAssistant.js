import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import MicIcon from "@mui/icons-material/Mic";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import laptopImg from "../../assets/laptop.png";

// Example suggestions for the assistant
const suggestions = [
  "Where can I find a laptop power bank?",
  "How do I book a study room?",
  "Tell me about charging options on campus",
  "What cameras are available for loan?",
  "How do I access GPU computing resources?",
];

// Example response data
const exampleResponses = {
  "Where can I find a laptop power bank?": {
    text: "Laptop power banks are available at the following locations:\n\n• International Village Basement\n• Second floor of EXP next to the student printers\n• Third floor of EXP next to the student printers\n\nYou can borrow them for up to 8 hours and they're compatible with most major laptop brands.",
    relatedResource: {
      id: 3,
      name: "Laptop power bank",
      description: "Available at International Village Basement and EXP floors",
      image: laptopImg,
      navigateTo:
        "https://service.northeastern.edu/tech?id=kb_article&sysparm_article=KB000018991",
    },
  },
  "How do I book a study room?": {
    text: "You can reserve study rooms in Snell Library through the Snell Booking system. Rooms are available for 3-hour blocks and include multimedia support and whiteboard facilities. Perfect for group projects and study sessions.",
    relatedResource: {
      id: 1,
      name: "Snell Booking",
      description: "Reserve study rooms in Snell Library",
      image: laptopImg,
      navigateTo: "https://northeastern.libcal.com/reserve/",
    },
  },
};

function AIAssistant(props) {
  const [inputValue, setInputValue] = React.useState("");
  const [conversation, setConversation] = React.useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your Resources Assistant. How can I help you find what you need today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const [isListening, setIsListening] = React.useState(false);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // React.useEffect(() => {
  //   scrollToBottom();
  // }, [conversation]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let responseContent =
        "I'm not sure about that. Could you please ask me something about the available resources?";
      let relatedResource = null;

      // Check if we have a predefined answer
      if (exampleResponses[userMessage.content]) {
        responseContent = exampleResponses[userMessage.content].text;
        relatedResource = exampleResponses[userMessage.content].relatedResource;
      }

      const assistantResponse = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        relatedResource,
      };

      setConversation((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => {
      const userMessage = {
        role: "user",
        content: suggestion,
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        let responseContent =
          "I'm not sure about that. Could you please ask me something about the available resources?";
        let relatedResource = null;

        // Check if we have a predefined answer
        if (exampleResponses[suggestion]) {
          responseContent = exampleResponses[suggestion].text;
          relatedResource = exampleResponses[suggestion].relatedResource;
        }

        const assistantResponse = {
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
          relatedResource,
        };

        setConversation((prev) => [...prev, assistantResponse]);
        setIsLoading(false);
      }, 1500);
    }, 300);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate a voice input
      setTimeout(() => {
        setInputValue("Where can I find a laptop power bank?");
        setIsListening(false);
      }, 2000);
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format multiline text to preserve newlines
  const formatMessageText = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleResourceClick = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
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
        minHeight: "calc(100vh - 64px)", // Adjust based on your header height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          pt: 2,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontSize: "1.8rem" }}>
          Resource Assistant
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<HelpOutlineIcon />}
          sx={{
            borderRadius: "6px",
          }}
        >
          Help
        </Button>
      </Box>

      <Paper
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Chat history container */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
            bgcolor: "#f9f9fc",
          }}
        >
          <List sx={{ width: "100%" }}>
            {conversation.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    flexDirection:
                      message.role === "user" ? "row-reverse" : "row",
                    mb: 2,
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        bgcolor:
                          message.role === "assistant" ? "#5c6bc0" : "#e0e0e0",
                        width: 36,
                        height: 36,
                      }}
                    >
                      {message.role === "assistant" ? (
                        <SmartToyIcon />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: "75%",
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor:
                          message.role === "assistant" ? "#ffffff" : "#e3f2fd",
                        borderRadius: "12px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Typography variant="body1">
                        {formatMessageText(message.content)}
                      </Typography>
                    </Paper>

                    {/* Timestamp */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        alignSelf:
                          message.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      {formatTimestamp(message.timestamp)}
                    </Typography>

                    {/* Related resource card */}
                    {message.relatedResource && (
                      <Paper
                        sx={{
                          mt: 2,
                          p: 1.5,
                          borderRadius: "8px",
                          display: "flex",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                        }}
                        onClick={() =>
                          handleResourceClick(
                            message.relatedResource.navigateTo
                          )
                        }
                      >
                        <Box
                          sx={{ width: 80, height: 80, flexShrink: 0, mr: 2 }}
                        >
                          <img
                            src={message.relatedResource.image}
                            alt={message.relatedResource.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {message.relatedResource.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {message.relatedResource.description}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{
                              py: 0.25,
                              minHeight: "24px",
                              fontSize: "0.7rem",
                              borderRadius: "6px",
                            }}
                          >
                            View Resource
                          </Button>
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </ListItem>
                {index < conversation.length - 1 && (
                  <Divider variant="middle" />
                )}
              </React.Fragment>
            ))}
            {isLoading && (
              <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#5c6bc0",
                      width: 36,
                      height: 36,
                    }}
                  >
                    <SmartToyIcon />
                  </Avatar>
                </ListItemAvatar>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <CircularProgress size={20} thickness={4} sx={{ mr: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Suggested questions */}
        {conversation.length < 3 && (
          <Box sx={{ px: 3, py: 2, backgroundColor: "#f0f7ff" }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Suggested questions:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    "&:hover": { backgroundColor: "#bbdefb" },
                    fontSize: "0.8rem",
                    height: "auto",
                    py: 0.5,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Input box */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me about resources..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "#f5f5f7",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color={isListening ? "error" : "default"}
                    onClick={toggleListening}
                    edge="end"
                  >
                    {isListening ? <KeyboardVoiceIcon /> : <MicIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            color="primary"
            sx={{ ml: 1 }}
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default AIAssistant;
