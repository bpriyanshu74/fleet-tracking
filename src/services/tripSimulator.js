import { TRIP_STATUS, EVENT_TYPES } from "../utils/constants.js";

export class TripSimulator {
  constructor(tripsData, simulationClock) {
    this.tripsData = tripsData;
    this.simulationClock = simulationClock;
    this.trips = [];
    this.listeners = new Set();
    this.isRunning = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.listeners.forEach((listener) => listener(event));
  }

  initializeTrips() {
    // Use Trip 1 start time as simulation inception
    const trip1StartTime = new Date(this.tripsData[0][0].timestamp).getTime();

    // Stagger other trips: +1 hour, +2 hours, etc.
    const hourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

    this.trips = this.tripsData.map((tripData, index) => {
      const tripStartTime = trip1StartTime + index * hourInMs;

      // Filter only location ping events for the path
      const locationEvents = tripData.filter(
        (event) =>
          event.event_type === EVENT_TYPES.LOCATION_PING && event.location
      );

      // Update all event timestamps to match staggered start time
      const originalStartTime = new Date(tripData[0].timestamp).getTime();
      const timeOffset = tripStartTime - originalStartTime;

      const adjustedTripData = tripData.map((event) => ({
        ...event,
        timestamp: new Date(
          new Date(event.timestamp).getTime() + timeOffset
        ).toISOString(),
      }));

      const adjustedLocationEvents = locationEvents.map((event) => ({
        ...event,
        timestamp: new Date(
          new Date(event.timestamp).getTime() + timeOffset
        ).toISOString(),
      }));

      // Get the actual starting location from the trip data
      const actualStartLocation = locationEvents[0]?.location || {
        lat: 0,
        lng: 0,
      };

      return {
        id: `trip_${index + 1}`,
        vehicleId: tripData[0]?.vehicle_id || `VH_00${index + 1}`,
        status: index === 0 ? TRIP_STATUS.IN_PROGRESS : TRIP_STATUS.UPCOMING,
        events: adjustedTripData,
        locationEvents: adjustedLocationEvents,
        currentEventIndex: 0,
        currentLocationIndex: 0,
        startTime: tripStartTime,
        currentLocation: index === 0 ? actualStartLocation : null,
        metrics: this.calculateInitialMetrics(tripData),
        lastUpdated: Date.now(),
        path: index === 0 ? [actualStartLocation] : [],
      };
    });

    // Set simulation clock to Trip 1 start time (INCEPTION)
    this.simulationClock.setSimulationStartTime(trip1StartTime);
  }

  calculateInitialMetrics(events) {
    return {
      distanceTravelled: 0,
      fuelConsumed: 0,
      overspeedCount: 0,
      idleTime: 0,
      score: 100,
      currentSpeed: 0,
    };
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.initializeTrips();

    // Subscribe to simulation clock updates
    this.clockUnsubscribe = this.simulationClock.subscribe(
      (currentSimulationTime) => {
        this.updateTrips(currentSimulationTime);
      }
    );

    this.simulationClock.start();
  }

  stop() {
    this.isRunning = false;
    if (this.clockUnsubscribe) {
      this.clockUnsubscribe();
    }
    this.simulationClock.stop();
  }

  updateTrips(currentSimulationTime) {
    let hasUpdates = false;

    this.trips.forEach((trip) => {
      // Check if trip should start (based on simulation time)
      if (
        trip.status === TRIP_STATUS.UPCOMING &&
        currentSimulationTime >= trip.startTime
      ) {
        trip.status = TRIP_STATUS.IN_PROGRESS;
        trip.currentLocation = trip.locationEvents[0]?.location || {
          lat: 0,
          lng: 0,
        };
        trip.path = [trip.currentLocation];
        hasUpdates = true;
      }

      // Only process events for active trips
      if (trip.status !== TRIP_STATUS.IN_PROGRESS) {
        return;
      }

      let locationUpdated = false;

      // Process location events for path following
      while (
        trip.currentLocationIndex < trip.locationEvents.length &&
        new Date(
          trip.locationEvents[trip.currentLocationIndex].timestamp
        ).getTime() <= currentSimulationTime
      ) {
        const locationEvent = trip.locationEvents[trip.currentLocationIndex];

        // Update current location smoothly
        trip.currentLocation = {
          lat: locationEvent.location.lat,
          lng: locationEvent.location.lng,
        };

        // Add to path
        trip.path.push({ ...locationEvent.location });

        // Update metrics
        if (locationEvent.movement?.speed_kmh) {
          trip.metrics.currentSpeed = locationEvent.movement.speed_kmh;
        }
        if (locationEvent.distance_travelled_km !== undefined) {
          trip.metrics.distanceTravelled = locationEvent.distance_travelled_km;
        }
        if (locationEvent.overspeed) {
          trip.metrics.overspeedCount++;
          trip.metrics.score = Math.max(0, trip.metrics.score - 2);
        }

        trip.currentLocationIndex++;
        locationUpdated = true;
        hasUpdates = true;
      }

      // Process other event types
      while (
        trip.currentEventIndex < trip.events.length &&
        new Date(trip.events[trip.currentEventIndex].timestamp).getTime() <=
          currentSimulationTime
      ) {
        const event = trip.events[trip.currentEventIndex];
        if (event.event_type !== EVENT_TYPES.LOCATION_PING) {
          this.processNonLocationEvent(trip, event);
        }
        trip.currentEventIndex++;
      }

      // Check if trip is completed
      if (
        trip.currentLocationIndex >= trip.locationEvents.length &&
        trip.status === TRIP_STATUS.IN_PROGRESS
      ) {
        trip.status = TRIP_STATUS.COMPLETED;
        hasUpdates = true;
      }

      if (locationUpdated) {
        trip.lastUpdated = Date.now();
      }
    });

    // Force sync to keep UI responsive
    if (hasUpdates) {
      this.notify({
        type: "TRIP_SYNC",
        trips: this.getTrips(),
        currentSimulationTime,
      });
    }
  }

  processNonLocationEvent(trip, event) {
    if (event.event_type === EVENT_TYPES.VEHICLE_TELEMETRY && event.telemetry) {
      trip.metrics.fuelConsumed =
        100 - (event.telemetry.fuel_level_percent || 0);
    }
  }

  getTrips() {
    return this.trips.map((trip) => ({
      ...trip,
      currentLocation: trip.currentLocation
        ? { ...trip.currentLocation }
        : null,
      metrics: { ...trip.metrics },
      path: trip.path ? [...trip.path] : [],
    }));
  }

  getTripById(tripId) {
    const trip = this.trips.find((trip) => trip.id === tripId);
    return trip
      ? {
          ...trip,
          currentLocation: trip.currentLocation
            ? { ...trip.currentLocation }
            : null,
          metrics: { ...trip.metrics },
          path: trip.path ? [...trip.path] : [],
        }
      : null;
  }
}
