import { useState, useEffect, useRef } from "react";
import { TripSimulator } from "../services/tripSimulator.js";
import { SimulationClock } from "../services/simulationClock.js";
import { TRIP_STATUS } from "../utils/constants.js";

// Import all 5 trip JSON files
import trip1Data from "../data/trip_1_cross_country.json";
import trip2Data from "../data/trip_2_urban_dense.json";
import trip3Data from "../data/trip_3_mountain_cancelled.json";
import trip4Data from "../data/trip_4_southern_technical.json";
import trip5Data from "../data/trip_5_regional_logistics.json";

export const useRealTimeData = () => {
  const [trips, setTrips] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [currentSimulationTime, setCurrentSimulationTime] = useState(null);
  const simulatorRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    // Create simulation clock
    clockRef.current = new SimulationClock();

    // Use all 5 separate trip JSON files
    const tripsData = [trip1Data, trip2Data, trip3Data, trip4Data, trip5Data];

    // Initialize simulator with clock
    simulatorRef.current = new TripSimulator(tripsData, clockRef.current);

    const unsubscribe = simulatorRef.current.subscribe((event) => {
      if (event.type === "TRIP_UPDATE" || event.type === "TRIP_SYNC") {
        setCurrentEvents((prev) => [...prev.slice(-20), event]);
        setUpdateCount((prev) => prev + 1);
        setCurrentSimulationTime(event.currentSimulationTime);

        // Update trips on sync events
        if (event.type === "TRIP_SYNC") {
          const currentTrips = simulatorRef.current.getTrips();
          setTrips(currentTrips);
        }
      }
    });

    simulatorRef.current.start();

    return () => {
      unsubscribe();
      simulatorRef.current?.stop();
    };
  }, []);

  // Force trips update more frequently for smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatorRef.current) {
        const currentTrips = simulatorRef.current.getTrips();
        setTrips(currentTrips);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getTripById = (tripId) => {
    return simulatorRef.current?.getTripById(tripId);
  };

  const tripsByStatus = trips.reduce((acc, trip) => {
    if (!acc[trip.status]) {
      acc[trip.status] = [];
    }
    acc[trip.status].push(trip);
    return acc;
  }, {});

  // Calculate fleet metrics
  const fleetMetrics = {
    totalTrips: trips.length,
    activeTrips: trips.filter((t) => t.status === "inprogress").length,
    averageScore:
      trips.length > 0
        ? Math.round(
            trips.reduce((sum, t) => sum + t.metrics.score, 0) / trips.length
          )
        : 0,
    totalDistance: trips.reduce(
      (sum, t) => sum + t.metrics.distanceTravelled,
      0
    ),
    totalOverspeeds: trips.reduce(
      (sum, t) => sum + t.metrics.overspeedCount,
      0
    ),
  };

  return {
    trips,
    tripsByStatus,
    currentEvents,
    currentSimulationTime,
    getTripById,
    updateCount,
    fleetMetrics,
  };
};
