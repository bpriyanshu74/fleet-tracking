import { useState, useEffect, useRef } from "react";
import { TripSimulator } from "../services/tripSimulator.js";
import { SimulationClock } from "../services/simulationClock.js";

// Trip JSON files
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
    clockRef.current = new SimulationClock();

    const tripsData = [trip1Data, trip2Data, trip3Data, trip4Data, trip5Data];

    simulatorRef.current = new TripSimulator(tripsData, clockRef.current);

    const unsubscribe = simulatorRef.current.subscribe((event) => {
      if (event.type === "TRIP_UPDATE" || event.type === "TRIP_SYNC") {
        setCurrentEvents((prev) => [...prev.slice(-20), event]);
        setUpdateCount((prev) => prev + 1);
        setCurrentSimulationTime(event.currentSimulationTime);
        if (event.type === "TRIP_SYNC") {
          setTrips(simulatorRef.current.getTrips(event.currentSimulationTime));
        }
      }
    });

    simulatorRef.current.start();

    return () => {
      unsubscribe();
      simulatorRef.current?.stop();
    };
  }, []);

  // Restart Simulation

  const restartSimulation = () => {
    simulatorRef.current?.stop();

    clockRef.current = new SimulationClock();

    const tripsData = [trip1Data, trip2Data, trip3Data, trip4Data, trip5Data];

    simulatorRef.current = new TripSimulator(tripsData, clockRef.current);

    setTrips([]);
    setCurrentEvents([]);
    setUpdateCount(0);

    const unsubscribe = simulatorRef.current.subscribe((event) => {
      if (event.type === "TRIP_UPDATE" || event.type === "TRIP_SYNC") {
        setCurrentEvents((prev) => [...prev.slice(-20), event]);
        setUpdateCount((prev) => prev + 1);
        setCurrentSimulationTime(event.currentSimulationTime);

        if (event.type === "TRIP_SYNC") {
          setTrips(simulatorRef.current.getTrips(event.currentSimulationTime));
        }
      }
    });

    simulatorRef.current.start();
    return unsubscribe;
  };
  // setting the simulation speed as per the multiplier
  const setSimulationSpeed = (multiplier) => {
    if (clockRef.current) {
      clockRef.current.setSpeed(multiplier);
    }
  };

  // Helpers

  const getTripById = (tripId) => {
    return simulatorRef.current?.getTripById(tripId);
  };

  const tripsByStatus = trips.reduce((acc, trip) => {
    if (!acc[trip.status]) acc[trip.status] = [];
    acc[trip.status].push(trip);
    return acc;
  }, {});

  // Fleet metrics

  const fleetMetrics = {
    totalTrips: trips.length,
    activeTrips: trips.filter((t) => t.status === "inprogress").length,

    totalDistance: trips.reduce((sum, t) => {
      return (
        sum + (t.metrics.totalDistance ?? t.metrics.distanceTravelled ?? 0)
      );
    }, 0),
  };

  return {
    trips,
    tripsByStatus,
    currentEvents,
    currentSimulationTime,
    restartSimulation,
    getTripById,
    updateCount,
    fleetMetrics,
    setSimulationSpeed,
  };
};
