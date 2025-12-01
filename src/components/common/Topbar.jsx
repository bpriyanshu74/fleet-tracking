import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import Restart from "./RestartSimulation";
import SpeedToggle from "./SpeedToggle";
import { Menu, X } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.toLowerCase() === "global") {
      navigate("/dashboard");
    } else {
      navigate("/fleet-not-found");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className="
        sticky top-0 z-30
        bg-white/90 backdrop-blur-md
        border-b border-gray-200 shadow-sm
      "
    >
      {/* Main Topbar Row */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer focus:outline-none shrink-0"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="h-8 w-auto sm:h-9 lg:h-10 drop-shadow-sm transition-transform hover:scale-105"
            />
          </button>

          <div className="hidden md:flex md:items-center w-full">
            {/* Flexible space between Logo and Search */}
            <div className="flex-1 min-w-4" />

            {/* Search Bar - Desktop */}
            <div className="flex-none w-full max-w-2xl mx-4 lg:mx-8">
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Flexible space between Search and Controls */}
            <div className="flex-1 min-w-4" />

            {/* Controls - Desktop */}
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="hidden lg:block text-sm font-medium text-gray-600"></div>
              <div className="flex items-center gap-2 lg:gap-3">
                <SpeedToggle />
                <Restart />
              </div>
            </div>
          </div>
          {/* Mobile Menu Button - visible on small screens */}
          <button
            onClick={toggleMenu}
            className="
              md:hidden
              p-2 rounded-lg
              text-gray-700 hover:text-gray-900
              hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors
              shrink-0
            "
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - appears below the main bar */}
      {isMenuOpen && (
        <div
          className="
            md:hidden
            bg-white
            border-t border-gray-200
            shadow-lg
            animate-in slide-in-from-top
            duration-200
          "
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {/* Search Bar Row */}
            <div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Controls Row */}
            <div>
              <div className="flex items-center gap-3">
                <SpeedToggle />
                <Restart />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
