import React, { useState } from "react";
import Navbar from "./components/navbar.js";
import Homepage from "./pages/homepage/Homepage.js";
import Inventory from "./pages/resources/Inventory.js";
import Assistant from "./pages/assistant/Assistant.js";
import AboutUs from "./pages/about/AboutUs.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Resources from "./pages/resources/Resources.js";
import Contribute from "./pages/contribute/Contribute.js";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true); // State to track drawer status

  const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  return (
    <Router>
      <div>
        <Navbar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
        <Routes>
          {/* Route to Homepage */}
          <Route path="/" element={<Navigate to="/homepage" />} />
          <Route
            path="/homepage"
            element={<Homepage drawerOpen={drawerOpen} />}
          />
          <Route
            path="/resources"
            element={<Inventory drawerOpen={drawerOpen} />}
          />
          <Route
            path="/ai-assistant"
            element={<Assistant drawerOpen={drawerOpen} />}
          />
          <Route
            path="/aboutus"
            element={<AboutUs drawerOpen={drawerOpen} />}
          />
          <Route
            path="/contribute"
            element={<Contribute drawerOpen={drawerOpen} />}
          />
          {/* Wildcard route for non-existing routes */}
          <Route path="*" element={<Navigate to="/homepage" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
