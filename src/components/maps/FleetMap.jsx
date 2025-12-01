import { useRealTimeDataContext } from "../../context/RealTimeDataContext";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useRef, useCallback } from "react";
import { useGoogleMaps } from "../../context/GoogleMapsContext";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "92vh",
};

const defaultCenter = {
  lat: 41.8781,
  lng: -87.6298,
};

const FleetMap = () => {
  const { isLoaded } = useGoogleMaps();
  const { trips, updateCount, currentSimulationTime } =
    useRealTimeDataContext();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const mapRef = useRef(null);

  const vehicleColors = ["#DC2626", "#2563EB", "#059669", "#D97706", "#7C3AED"];
  const getVehicleColor = (i) => vehicleColors[i % vehicleColors.length];

  const createCustomIcon = (color) => ({
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z",
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    scale: 1.5,
  });

  const getPathOptions = (color) => ({
    strokeColor: color,
    strokeOpacity: 0.6,
    strokeWeight: 4,
    fillColor: color,
    fillOpacity: 0.35,
  });

  const onLoad = useCallback(
    (mapInstance) => {
      mapRef.current = mapInstance;

      const activeTrips = trips.filter(
        (t) => t.status === "inprogress" && t.currentLocation
      );

      if (activeTrips.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();

        activeTrips.forEach((t) => {
          if (t.currentLocation) bounds.extend(t.currentLocation);
          if (Array.isArray(t.path)) {
            t.path.forEach((p) => bounds.extend(p));
          }
        });

        mapInstance.fitBounds(bounds);
      }
    },
    [trips]
  );

  const activeTrips = trips.filter(
    (trip) => trip.status === "inprogress" && trip.currentLocation
  );

  const formatSimulationTime = () => {
    if (!currentSimulationTime) return "Starting...";
    return new Date(currentSimulationTime)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");
  };
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-600">Loading map…</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Info Panel */}
      <div className="absolute top-14 left-2 z-10 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm space-y-1">
        <div>Active Vehicles: {activeTrips.length}</div>
        <div>Simulation: {formatSimulationTime()}</div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={2}
        onLoad={onLoad}
        options={{
          zoomControl: true,
          minZoom: 2,
          maxZoom: 19,
        }}
      >
        {activeTrips.map((trip, index) => (
          <div key={`trip-${trip.id}`}>
            {trip.path?.length > 1 && (
              <Polyline
                path={trip.path}
                options={getPathOptions(getVehicleColor(index))}
              />
            )}

            {trip.currentLocation && (
              <Marker
                position={trip.currentLocation}
                icon={createCustomIcon(getVehicleColor(index))}
                title={`${trip.vehicleId}`}
                onClick={() => setSelectedTrip(trip)}
              />
            )}
          </div>
        ))}

        {selectedTrip && (
          <InfoWindow
            position={selectedTrip.currentLocation}
            onCloseClick={() => setSelectedTrip(null)}
          >
            <div className="p-3 min-w-56 bg-white rounded-lg shadow-lg">
              ...
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default FleetMap;
