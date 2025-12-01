import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RealTimeDataProvider } from "./context/RealTimeDataContext";
import { GoogleMapsProvider } from "./context/GoogleMapsContext";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import TripDetails from "./components/pages/TripDetails";
import FleetNotFound from "./components/pages/FleetNotFound";
import "./index.css";

function App() {
  return (
    <RealTimeDataProvider>
      <GoogleMapsProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trip/:tripId" element={<TripDetails />} />
              <Route path="/fleet-not-found" element={<FleetNotFound />} />
            </Routes>
          </div>
        </Router>
      </GoogleMapsProvider>
    </RealTimeDataProvider>
  );
}

export default App;
