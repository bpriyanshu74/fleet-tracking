import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";

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
            {/* Optional: brand */}
            {/* <span className="font-semibold text-lg">FleetTracker</span> */}
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Right-side icons (future profile/notifications) */}
          <div className="flex items-center gap-3">
            <button
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              title="Notifications (Coming Soon)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.657a2 2 0 01-3.714 0M6 8a6 6 0 1112 0c0 3.866 1.448 6 3 6H3c1.552 0 3-2.134 3-6z"
                />
              </svg>
            </button>

            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm shadow-inner">
              P
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
