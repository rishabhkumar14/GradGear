# GradGear - University Resource Portal

GradGear is a comprehensive web application that helps university students and staff discover, browse, and book various campus resources - from study spaces to technical equipment.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [AI Chat System](#ai-chat-system)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Project Overview

GradGear serves as a centralized platform for accessing various university resources, solving the common problem of scattered information about available equipment and spaces. The application features an intelligent AI assistant that helps users find exactly what they need through natural language queries.

### Key Features

- **Resource Discovery**: Browse a comprehensive catalog of university resources
- **Intelligent Search**: Find resources using natural language queries
- **Booking System**: Reserve resources directly through the platform
- **AI Assistant**: Get personalized recommendations through conversation
- **Category Navigation**: Browse resources by type (spaces, laptops, chargers, etc.)

### Technology Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express
- **AI**: Google Generative AI (Gemini)
- **Data Storage**: Local .data file

## Features

### Resource Categories

GradGear organizes resources into several categories:

1. **Spaces**: Study rooms, meeting spaces, and classrooms
2. **Lockers**: Power banks and storage options
3. **Chargers**: Various device chargers (MagSafe, USB-C, Surface)
4. **Laptops**: Computing devices (Windows, Mac, Surface)
5. **Accessories**: Projectors, microscopes, and other equipment
6. **Cameras**: Recording devices and photography equipment
7. **Vending Accessories**: Smaller items like presenters and voice recorders
8. **GPU Computing**: High-performance computing resources

### AI Chat Assistant

The AI assistant helps users find resources through conversational interaction:

- Understands natural language queries
- Handles vague or indirect requests
- Provides personalized recommendations
- Shows relevant booking links
- Groups similar resources together in responses

## Installation

### Prerequisites

- Node.js 14+ and npm
- Google AI API key for Gemini

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gradgear.git
cd gradgear/backend
```

2. Install dependencies:

```bash
npm i
```

3. Create a `.env` file with the following variables:

```
NODE_ENV=development
PORT=3500
CORS_ORIGIN=http://localhost:3000
IMAGES_PATH=assets/images
BASE_URL=http://localhost:3500
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
ADMIN_EMAIL=your_admin_email@gmail.com
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the backend server:

```bash
nodemon server.js
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm i
```

3. Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:3500/api
```

4. Start the frontend development server:

```bash
npm start
```

## AI Chat System

The AI chat system uses Google's Generative AI (Gemini) for semantic search and natural language understanding.

### Key Components

1. **Embedding Generation**: Creates vector representations of resources and queries
2. **Semantic Search**: Finds resources similar to user queries
3. **Intent Analysis**: Identifies the user's needs from their query
4. **Response Generation**: Creates helpful, formatted responses
5. **Resource Linking**: Provides direct booking links

### Working with Resources

The system extracts meaningful information from each resource:

- Name and description
- Detailed features and use cases
- Associated tags (chips)
- Locations and availability
- Alternative names and synonyms

### Natural Language Processing

The AI system can understand:

- Direct queries ("I need a laptop")
- Vague requests ("My battery died")
- Category explorations ("Show me all cameras")
- Plurals and synonyms ("cams" → "cameras")
- Problem descriptions ("I need to record audio")

### Key Enhancements

The AI chat system has been enhanced to:

- Handle vague and indirect queries better (e.g., "My laptop died" → suggest chargers)
- Recognize synonyms and variations (e.g., "cams", "cam", "camera", "cameras")
- Extract context from enhanced resource details
- Show all relevant options when asked about a category
- Provide elegant booking links in responses
- Group similar resources for better readability

## API Documentation

### Resources API

- `GET /api/resources`: Get all resources
- `GET /api/resources/:id`: Get a specific resource
- `GET /api/resources/category/:category`: Get resources by category
- `POST /api/resources`: Create a resource (admin only)
- `PUT /api/resources/:id`: Update a resource (admin only)
- `DELETE /api/resources/:id`: Delete a resource (admin only)

### Chat API

- `POST /api/chat`: Send a message to the AI assistant
  - Request body: `{ query: "user message here" }`
  - Response: `{ success: true, response: "AI response", relatedResources: [...] }`

### Auth API

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login an existing user
- `GET /api/auth/profile`: Get the current user's profile

### Bookings API

- `GET /api/bookings`: Get user's bookings
- `POST /api/bookings`: Create a new booking
- `DELETE /api/bookings/:id`: Cancel a booking

## Troubleshooting

### Common Issues

1. **AI Service Not Responding**:
   - Check API key in environment variables
   - Verify network connectivity to Google AI API
   - Check request formatting

2. **Resource Images Not Loading**:
   - Verify image paths in resource data
   - Check BASE_URL configuration
   - Ensure images exist in the correct directory

3. **Chat Not Finding Resources**:
   - Check console logs for embedding initialization errors
   - Verify that the .data file is accessible
   - Try restarting the backend server

4. **Email Notifications Not Sending**:
   - Verify SMTP settings in .env file
   - Check console for SMTP connection errors
   - Ensure the email templates exist

### Logging

The application uses console logging for development purposes. Check your terminal for:
- Error messages
- AI chat processing logs
- Resource initialization logs

---

© 2025 GradGear Team. All rights reserved.