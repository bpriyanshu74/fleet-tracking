import { createContext, useContext, useState, useEffect } from "react";

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within GoogleMapsProvider");
  }
  return context;
};

export const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script is already loading, wait for it
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);

      return () => clearInterval(checkLoaded);
    }

    // Load Google Maps script with proper async loading
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=geometry&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define the callback function
    window.initMap = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  const value = {
    isLoaded,
    loadError,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
