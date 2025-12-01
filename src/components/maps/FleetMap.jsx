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
  minHeight: "600px",
};

const defaultCenter = {
  lat: 41.8781,
  lng: -87.6298,
};

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

const FleetMap = () => {
  const { isLoaded } = useGoogleMaps();
  const { trips, currentSimulationTime } = useRealTimeDataContext();

  const [selectedTripId, setSelectedTripId] = useState(null);
  const mapRef = useRef(null);

  // Always fetch latest trip data for real-time InfoWindow updates
  const selectedTrip = trips.find((t) => t.id === selectedTripId);

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
    <div className="w-full h-full">
      {/* Info Panel */}
      <div className="absolute top-40 left-2 z-10 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm space-y-1">
        <div>Active Vehicles: {activeTrips.length}</div>
        <div>Simulation: {formatSimulationTime()}</div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={3}
        onLoad={onLoad}
        options={{
          zoomControl: true,
          minZoom: 3,
          maxZoom: 19,
        }}
      >
        {/* Render active trips */}
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
                onClick={() => setSelectedTripId(trip.id)} // 🔥 Select trip by ID for real-time updates
              />
            )}
          </div>
        ))}

        {/* Real-Time Updating Popup Card */}
        {selectedTrip && selectedTrip.currentLocation && (
          <InfoWindow
            position={selectedTrip.currentLocation}
            onCloseClick={() => setSelectedTripId(null)}
          >
            <div className="bg-white rounded-xl shadow-xl p-4 w-72 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedTrip.vehicleId}
                </h3>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {selectedTrip.status}
                </span>
              </div>

              {/* Trip Details */}
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Trip ID:</span>
                  <span>{selectedTrip.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Latitude:</span>
                  <span>{selectedTrip.currentLocation.lat.toFixed(5)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Longitude:</span>
                  <span>{selectedTrip.currentLocation.lng.toFixed(5)}</span>
                </div>

                {selectedTrip.speed !== undefined && (
                  <div className="flex justify-between">
                    <span className="font-medium">Speed:</span>
                    <span>{selectedTrip.speed} km/h</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                Updating live…
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default FleetMap;
