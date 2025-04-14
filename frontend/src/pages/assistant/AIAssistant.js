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
  Card,
  CardContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import MicIcon from "@mui/icons-material/Mic";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReactMarkdown from 'react-markdown';

// Import API service
import aiChatService from "../../services/aiChatService";

// Import default image
import laptopImg from "../../assets/laptop.png";

// Sample suggestions to help users get started
const suggestions = [
  "Where can I find a laptop power bank?",
  "How do I book a study room?",
  "Tell me about charging options on campus",
  "What cameras are available for loan?",
  "How do I access GPU computing resources?",
  "I need to record audio for a project",
  "I'm looking for a microscope",
];

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
  const [error, setError] = React.useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
    setError(null);

    try {
      // Send the query to the AI chat service
      const response = await aiChatService.sendQuery(userMessage.content);
      
      if (response.success) {
        const assistantResponse = {
          role: "assistant",
          content: response.response,
          timestamp: new Date(),
          relatedResources: response.relatedResources || [],
          matchType: response.matchType,
        };

        setConversation((prev) => [...prev, assistantResponse]);
      } else {
        // Handle error response
        setError(response.error || "Failed to get a response. Please try again.");
        
        const errorResponse = {
          role: "assistant",
          content: response.error || "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your question.",
          timestamp: new Date(),
          isError: true,
        };
        
        setConversation((prev) => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      setError("An unexpected error occurred. Please try again.");
      
      const errorResponse = {
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        isError: true,
      };
      
      setConversation((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    
    // Small delay to update UI before sending
    setTimeout(() => {
      const userMessage = {
        role: "user",
        content: suggestion,
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);
      setError(null);

      // Send the suggestion to the AI service
      aiChatService.sendQuery(suggestion)
        .then(response => {
          if (response.success) {
            const assistantResponse = {
              role: "assistant",
              content: response.response,
              timestamp: new Date(),
              relatedResources: response.relatedResources || [],
              matchType: response.matchType,
            };

            setConversation((prev) => [...prev, assistantResponse]);
          } else {
            setError(response.error || "Failed to get a response. Please try again.");
            
            const errorResponse = {
              role: "assistant",
              content: response.error || "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your question.",
              timestamp: new Date(),
              isError: true,
            };
            
            setConversation((prev) => [...prev, errorResponse]);
          }
        })
        .catch(error => {
          console.error("Error processing suggestion:", error);
          
          setError("An unexpected error occurred. Please try again.");
          
          const errorResponse = {
            role: "assistant",
            content: "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your question.",
            timestamp: new Date(),
            isError: true,
          };
          
          setConversation((prev) => [...prev, errorResponse]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate a voice input (in a real app, this would use the Web Speech API)
      setTimeout(() => {
        setInputValue("Where can I find a laptop power bank?");
        setIsListening(false);
      }, 2000);
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
                          message.role === "assistant" 
                            ? message.isError ? "#ffebee" : "#ffffff" 
                            : "#e3f2fd",
                        borderRadius: "12px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      {message.role === "assistant" ? (
                        message.isError ? (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
                            <Typography variant="body1">{message.content}</Typography>
                          </Box>
                        ) : (
                          <ReactMarkdown 
                            components={{
                              p: (props) => <Typography variant="body1" {...props} sx={{ mb: 1 }} />,
                              ul: (props) => <Box component="ul" sx={{ ml: 2, mt: 1, mb: 1 }} {...props} />,
                              li: (props) => <Typography component="li" variant="body1" sx={{ mb: 0.5 }} {...props} />,
                              a: (props) => <Button 
                                component="a" 
                                variant="text" 
                                color="primary"
                                size="small"
                                href={props.href}
                                target="_blank"
                                sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'bold' }}
                                {...props}
                              />
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )
                      ) : (
                        <Typography variant="body1">{message.content}</Typography>
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

                    {/* Related resources */}
                    {message.relatedResources && message.relatedResources.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {message.relatedResources.slice(0, 2).map((resource) => (
                          <Card
                            key={resource.id}
                            sx={{
                              display: "flex",
                              cursor: resource.navigateTo && resource.navigateTo !== "#" ? "pointer" : "default",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              },
                              borderRadius: "8px",
                              overflow: "hidden",
                            }}
                            onClick={() => handleResourceClick(resource.navigateTo)}
                          >
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "#f5f5f5",
                              }}
                            >
                              <img
                                src={resource.image || laptopImg}
                                alt={resource.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.src = laptopImg; // Fallback image
                                }}
                              />
                            </Box>
                            <CardContent sx={{ py: 1, flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {resource.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 0.5,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {resource.description?.split('.')[0]}.
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  {resource.chips?.slice(0, 2).map((chip, idx) => (
                                    <Chip
                                      key={idx}
                                      label={chip}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  ))}
                                </Box>
                                {resource.navigateTo && resource.navigateTo !== "#" && (
                                  <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    sx={{ p: 0, minHeight: 0, fontSize: "0.75rem" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(resource.navigateTo, "_blank");
                                    }}
                                  >
                                    View
                                  </Button>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
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
              Try asking:
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