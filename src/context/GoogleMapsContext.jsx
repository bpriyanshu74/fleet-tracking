import { createContext, useContext, useState, useEffect, useRef } from "react";

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
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // If script exists but maps aren't loaded yet, wait for them
      if (!window.google || !window.google.maps) {
        // Create a proper callback that won't be cleaned up
        const originalOnLoad = existingScript.onload;
        existingScript.onload = () => {
          if (originalOnLoad) originalOnLoad();
          setIsLoaded(true);
        };

        existingScript.onerror = () => {
          setLoadError(new Error("Failed to load Google Maps"));
        };
      } else {
        setIsLoaded(true);
      }
      return;
    }

    // Load Google Maps script with proper async loading
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=geometry`;
    script.async = true;
    script.defer = true;

    // Use both onload and callback to ensure it works
    script.onload = () => {
      const checkMapsReady = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setTimeout(checkMapsReady, 100);
        }
      };
      checkMapsReady();
    };

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);
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
