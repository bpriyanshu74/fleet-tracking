import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import Restart from "./RestartSimulation";
import SpeedToggle from "./SpeedToggle";

const Topbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.toLowerCase() === "global") {
      navigate("/dashboard");
    } else {
      navigate("/fleet-not-found");
    }
  };

  return (
    <header
      className="
        sticky top-0 z-20
        bg-white/80 backdrop-blur-md
        border-b border-gray-200
        shadow-sm
        h-16 flex items-center
      "
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="h-9 w-auto drop-shadow-sm"
            />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Right-side icons (future profile/notifications) */}
          <div className="flex items-center gap-3">
            <SpeedToggle />
            <Restart />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
