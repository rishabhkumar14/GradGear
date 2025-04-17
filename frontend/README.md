# GradGear

GradGear is an AI-powered platform designed to help university students discover, locate, and reserve campus resources that are often overlooked due to being scattered across departments. The platform simplifies access to various technology, equipment, and spaces, ensuring users have the tools they need for skill development and career growth.

![GradGear Logo](src/assets/logo.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components](#components)
- [API Integration](#api-integration)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## Overview

GradGear was developed for the Human-Computer Interaction course (CS-5340) at Northeastern University. The platform serves as a centralized hub for various campus resources, making them more accessible and easier to discover through intuitive navigation and AI assistance.

## Features

- **Resource Discovery and Navigation**

  - Browse resources organized by categories
  - Collapsible category sections
  - Search functionality with filtering options
  - Detailed resource cards with key information

- **AI Assistant**

  - Natural language interaction to find resources
  - Contextual resource recommendations
  - Suggested questions for easy starting points
  - Voice input capability

- **User Dashboard**

  - Overview of available resources
  - Usage statistics and metrics
  - Quick access to frequently used resources

- **Mobile Responsive Design**

  - Optimized for all device sizes
  - Touch-friendly interface
  - Adaptive layouts for different screen sizes

- **User Feedback System**
  - Rating mechanism for resources and platform
  - Feedback submission for feature requests and improvements
  - Contact form for direct communication

## Tech Stack

- **Frontend**
  - React.js
  - Material UI
  - JavaScript (ES6+)
- **State Management**

  - React Hooks

- **Routing**

  - React Router

- **Styling**

  - Material UI theming and styled components
  - Responsive design principles

- **AI Integration**
  - Custom AI assistant interface (ready for backend integration)

## Installation

1. **Clone the repository**

   ```
   git clone https://github.com/rishabhkumar14/GradGear.git
   cd GradGear
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Start the development server**

   ```
   npm start
   ```

4. **Build for production**
   ```
   npm run build
   ```

## Usage

Once the application is running, you'll have access to:

- **Homepage**: Overview dashboard with key metrics and quick access cards
- **Resources**: Browse all available resources by category
- **AI Assistant**: Get help finding resources through natural language interaction
- **About Us**: Learn about the platform and provide feedback
- **Contribute**: Suggest new resources or improvements

## Project Structure

```
GradGear/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/
│   │   ├── headers/
│   │   ├── laptop.png
│   │   ├── logo.png
│   │   └── ...
│   ├── components/
│   │   └── navbar.js
│   ├── pages/
│   │   ├── about/
│   │   │   └── AboutUs.js
│   │   ├── assistant/
│   │   │   └── Assistant.js
│   │   ├── contribute/
│   │   │   └── Contribute.js
│   │   ├── homepage/
│   │   │   ├── Homepage.js
│   │   │   └── HomePageTable.js
│   │   └── resources/
│   │       ├── Inventory.js
│   │       ├── Resources.js
│   │       └── ResourcesData.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Components

### Core Components

- **Navbar**: Side navigation with collapsible drawer
- **Resources**: Main resource browsing interface with collapsible categories
- **AI Assistant**: Interactive chat interface for resource discovery
- **AboutUsData**: Information, feedback, and contact forms
- **Homepage**: Dashboard view with metrics and resource access

### Shared UI Components

- **Resource Cards**: Display resource information with consistent styling
- **Category Headers**: Collapsible section headers with icons
- **Search & Filter**: Resource discovery tools

## API Integration

The application is designed with placeholders for API integration:

- Resource data currently uses static data in `ResourcesData.js`
- AI Assistant uses example responses that can be replaced with actual API calls
- Form submissions in About/Contact pages log to console but can be connected to backend services

To integrate with a backend:

1. Replace static data sources with API calls
2. Implement proper authentication
3. Connect form submissions to appropriate endpoints

## Future Enhancements

- Real-time resource availability tracking
- User authentication and personalization
- Resource reservation system
- Admin dashboard for resource management
- Enhanced AI capabilities with natural language processing
- Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to suggest improvements or add new features.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

This project was developed by students as part of the Human-Computer Interaction course CS-5340 at Northeastern University.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 GradGear Team. All rights reserved.
