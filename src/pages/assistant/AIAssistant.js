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
  ListItemAvatar,
  Divider,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import MicIcon from "@mui/icons-material/Mic";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// Example suggestions for the assistant
const suggestions = [
  "Where can I find a laptop power bank?",
  "How do I book a study room?",
  "Tell me about charging options on campus",
  "What cameras are available for loan?",
  "How do I access GPU computing resources?",
];

function AIAssistant(props) {
  const theme = useTheme();
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
  const [isHelpDialogOpen, setIsHelpDialogOpen] = React.useState(false); // State for Help dialog
  const [isErrorDialogOpen, setIsErrorDialogOpen] = React.useState(false); // State for error dialog
  const [errorDialogMessage, setErrorDialogMessage] = React.useState(""); // State for error message
  const messagesEndRef = React.useRef(null);
  const [isListening, setIsListening] = React.useState(false);

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

    try {
      // Simulate chatbot thinking
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5-second delay

      // Send query to backend
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: inputValue }),
      });

      const data = await response.json();

      // --- ADD THIS LOGGING ---
      console.log("--- FRONTEND Received Data ---");
      console.log("Raw data object:", JSON.stringify(data, null, 2));
      console.log("data.response:", data.response);
      console.log("----------------------------");
      // --- END LOGGING ---

      const assistantResponse = {
        role: "assistant",
        content: data.response || (data.success ? "" : data.error || "Error processing response."),
        timestamp: new Date(),
        relatedResources: data.relatedResources || [],
      };

      setConversation((prev) => [...prev, assistantResponse]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const toggleListening = () => {
    // Check if the browser supports SpeechRecognition
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition is only supported on Google Chrome. Please use Chrome to access this feature.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; // Set the language
    recognition.interimResults = false; // Only return final results
    recognition.maxAlternatives = 1; // Return only one alternative

    if (!isListening) {
      console.log("Starting speech recognition...");
      setIsListening(true);

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the transcribed text
        console.log("Speech recognized:", transcript); // Debugging log
        setInputValue(transcript); // Set the transcribed text in the input box
        setIsListening(false); // Stop listening after capturing the speech
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error); // Debugging log
        if (event.error === "network") {
          setErrorDialogMessage(
            "Network error: Please check your internet connection and try using Internet Explorer, Microsoft Edge, or Google Chrome."
          );
          setIsErrorDialogOpen(true); // Open the error dialog
        } else if (event.error === "not-allowed") {
          setErrorDialogMessage(
            "Microphone access is blocked. Please allow microphone access in your browser settings."
          );
          setIsErrorDialogOpen(true); // Open the error dialog
        } else {
          setErrorDialogMessage("An error occurred during speech recognition. Please try again.");
          setIsErrorDialogOpen(true); // Open the error dialog
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended."); // Debugging log
        setIsListening(false); // Ensure the listening state is reset
      };
    } else {
      console.log("Stopping speech recognition...");
      setIsListening(false);
      recognition.stop(); // Stop the recognition process
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleHelpClick = () => {
    setIsHelpDialogOpen(true); // Open the Help dialog
  };

  const handleHelpDialogClose = () => {
    setIsHelpDialogOpen(false); // Close the Help dialog
  };

  const handleErrorDialogClose = () => {
    setIsErrorDialogOpen(false); // Close the error dialog
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme.palette.background.default,
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
          onClick={handleHelpClick} // Open Help dialog on click
        >
          Help
        </Button>
      </Box>

      {/* Help Dialog */}
      <Dialog open={isHelpDialogOpen} onClose={handleHelpDialogClose}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This chatbot helps you navigate resources available on our platform.
            If the resource you're looking for is not available, feel free to
            contribute when you find information about the resource.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{errorDialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat history and input box */}
      <Paper
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
        }}
      >
        {/* Chat history container */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
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
                          message.role === "assistant"
                            ? theme.palette.primary.main
                            : theme.palette.grey[400],
                        color:
                          message.role === "assistant"
                            ? theme.palette.primary.contrastText
                            : theme.palette.getContrastText(theme.palette.grey[400]),
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
                      alignItems:
                        message.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        padding: 1.5,
                        bgcolor:
                          message.role === "assistant"
                            ? theme.palette.background.paper
                            : theme.palette.primary.light,
                        color:
                          message.role === "assistant"
                            ? theme.palette.text.primary
                            : theme.palette.primary.contrastText,
                        borderRadius: "12px",
                        boxShadow: theme.shadows[1],
                        wordWrap: 'break-word',
                        maxWidth: '100%',
                      }}
                    >
                      {message.role === 'assistant' ? (
                        <Box
                          sx={{
                            '& p': { my: 0.5 },
                            '& ul': { pl: 2.5, my: 0.5 },
                            '& li': { mb: 0.5 },
                            '& a, & a:link, & a:visited': {
                              color: message.role === 'assistant'
                                     ? theme.palette.primary.main
                                     : theme.palette.primary.dark,
                              textDecoration: 'underline !important',
                              cursor: 'pointer !important',
                              fontWeight: 500,
                              '&:hover': {
                                opacity: 0.8,
                                textDecoration: 'none !important',
                              },
                            },
                            '& strong': {
                              fontWeight: 'bold',
                            },
                          }}
                        >
                           <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                             {message.content || ""}
                           </ReactMarkdown>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      )}
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
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
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
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
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
