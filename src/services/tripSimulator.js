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
    const trip1StartTime = new Date(this.tripsData[0][0].timestamp).getTime();
    const hourInMs = 60 * 60 * 1000;

    this.trips = this.tripsData.map((tripData, index) => {
      const tripStartTime = trip1StartTime + index * hourInMs;

      // filter location pings
      const locationEvents = tripData.filter(
        (e) => e.event_type === EVENT_TYPES.LOCATION_PING && e.location
      );

      const originalStart = new Date(tripData[0].timestamp).getTime();
      const offset = tripStartTime - originalStart;

      const adjustedEvents = tripData.map((event) => ({
        ...event,
        timestamp: new Date(
          new Date(event.timestamp).getTime() + offset
        ).toISOString(),
      }));

      const adjustedLocationEvents = locationEvents.map((event) => ({
        ...event,
        timestamp: new Date(
          new Date(event.timestamp).getTime() + offset
        ).toISOString(),
      }));

      const startingLocation = locationEvents[0]?.location || {
        lat: 0,
        lng: 0,
      };

      return {
        id: tripData[0]?.trip_id || `trip_${index + 1}`,
        vehicleId: tripData[0]?.vehicle_id || `VH_00${index + 1}`,

        status: index === 0 ? TRIP_STATUS.IN_PROGRESS : TRIP_STATUS.UPCOMING,

        events: adjustedEvents,
        locationEvents: adjustedLocationEvents,

        currentEventIndex: 0,
        currentLocationIndex: 0,

        startTime: tripStartTime,
        currentLocation: index === 0 ? startingLocation : null,

        metrics: this.calculateInitialMetrics(),
        lastUpdated: Date.now(),

        path: index === 0 ? [startingLocation] : [],

        hasFinalized: false,
      };
    });

    this.simulationClock.setSimulationStartTime(trip1StartTime);
  }

  calculateInitialMetrics() {
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

    this.clockUnsubscribe = this.simulationClock.subscribe((simTime) =>
      this.updateTrips(simTime)
    );

    this.simulationClock.start();
  }

  stop() {
    this.isRunning = false;
    if (this.clockUnsubscribe) this.clockUnsubscribe();
    this.simulationClock.stop();
  }

  updateTrips(currentSimulationTime) {
    let hasUpdates = false;

    this.trips.forEach((trip) => {
      // UPCOMING → IN_PROGRESS
      if (
        trip.status === TRIP_STATUS.UPCOMING &&
        currentSimulationTime >= trip.startTime
      ) {
        trip.status = TRIP_STATUS.IN_PROGRESS;
        trip.currentLocation = trip.locationEvents[0]?.location || null;
        trip.path = trip.currentLocation ? [trip.currentLocation] : [];
        hasUpdates = true;
      }

      // STOP updating finalized trips
      if (
        trip.status === TRIP_STATUS.COMPLETED ||
        trip.status === TRIP_STATUS.CANCELLED
      ) {
        return;
      }

      let locationUpdated = false;

      // LOCATION PINGS
      while (
        trip.currentLocationIndex < trip.locationEvents.length &&
        new Date(
          trip.locationEvents[trip.currentLocationIndex].timestamp
        ).getTime() <= currentSimulationTime
      ) {
        const locEvent = trip.locationEvents[trip.currentLocationIndex];

        trip.currentLocation = { ...locEvent.location };
        trip.path.push({ ...locEvent.location });

        if (locEvent.movement?.speed_kmh) {
          trip.metrics.currentSpeed = locEvent.movement.speed_kmh;
        }

        if (locEvent.distance_travelled_km !== undefined) {
          trip.metrics.distanceTravelled = locEvent.distance_travelled_km;
        }

        if (locEvent.overspeed) {
          trip.metrics.overspeedCount++;
          trip.metrics.score = Math.max(0, trip.metrics.score - 2);
        }

        trip.currentLocationIndex++;
        locationUpdated = true;
        hasUpdates = true;
      }

      // NON LOCATION EVENTS
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

      // AUTO-COMPLETE
      if (
        !trip.hasFinalized &&
        trip.currentLocationIndex >= trip.locationEvents.length &&
        trip.status === TRIP_STATUS.IN_PROGRESS
      ) {
        trip.status = TRIP_STATUS.COMPLETED;
        trip.metrics.currentSpeed = 0;
        trip.hasFinalized = true;
        hasUpdates = true;
      }

      if (locationUpdated) {
        const lastLoc = trip.locationEvents[trip.currentLocationIndex - 1];
        if (lastLoc) trip.lastUpdated = lastLoc.timestamp;
      }
    });

    if (hasUpdates) {
      this.notify({
        type: "TRIP_SYNC",
        trips: this.getTrips(currentSimulationTime),
        currentSimulationTime,
      });
    }
  }

  processNonLocationEvent(trip, event) {
    // COMPLETED EVENT
    if (event.event_type === EVENT_TYPES.TRIP_COMPLETED) {
      trip.status = TRIP_STATUS.COMPLETED;
      trip.hasFinalized = true;

      trip.metrics.totalDistance =
        event.total_distance_km ?? trip.metrics.distanceTravelled;
      trip.metrics.totalDuration = event.total_duration_hours ?? 0;
      trip.metrics.fuelConsumed =
        event.fuel_consumed_percent ?? trip.metrics.fuelConsumed;

      trip.metrics.currentSpeed = 0;

      trip.currentEventIndex = trip.events.length;
      trip.currentLocationIndex = trip.locationEvents.length;
      return;
    }

    // CANCELLED EVENT
    if (event.event_type === EVENT_TYPES.TRIP_CANCELLED) {
      trip.status = TRIP_STATUS.CANCELLED;
      trip.hasFinalized = true;

      trip.metrics.cancellationReason = event.cancellation_reason || "unknown";
      trip.metrics.distanceCompleted = event.distance_completed_km || 0;
      trip.metrics.elapsedTimeMinutes = event.elapsed_time_minutes || 0;

      trip.metrics.currentSpeed = 0;

      trip.currentEventIndex = trip.events.length;
      trip.currentLocationIndex = trip.locationEvents.length;
      return;
    }

    // TELEMETRY (only live)
    if (
      trip.status === TRIP_STATUS.IN_PROGRESS &&
      event.event_type === EVENT_TYPES.VEHICLE_TELEMETRY &&
      event.telemetry
    ) {
      const fuelLevel = event.telemetry.fuel_level_percent;

      if (fuelLevel !== undefined) {
        if (trip.metrics._initialFuelLevel === undefined) {
          trip.metrics._initialFuelLevel = fuelLevel;
        }

        trip.metrics.fuelConsumed = trip.metrics._initialFuelLevel - fuelLevel;
      }
    }
  }


  // FINAL: getTrips with countdown

  getTrips(currentSimulationTime) {
    return this.trips.map((t) => {
      const startInSeconds =
        t.startTime && currentSimulationTime
          ? Math.max(
              0,
              Math.floor((t.startTime - currentSimulationTime) / 1000)
            )
          : 0;

      return {
        ...t,
        startInSeconds,
        currentLocation: t.currentLocation ? { ...t.currentLocation } : null,
        metrics: { ...t.metrics },
        path: t.path ? [...t.path] : [],
      };
    });
  }


  // TripById MUST also include countdown

  getTripById(tripId) {
    const t = this.trips.find((x) => x.id === tripId);
    if (!t) return null;

    const currentSimTime = this.simulationClock.getCurrentSimulationTime?.();

    const startInSeconds =
      t.startTime && currentSimTime
        ? Math.max(0, Math.floor((t.startTime - currentSimTime) / 1000))
        : 0;

    return {
      ...t,
      startInSeconds,
      currentLocation: t.currentLocation ? { ...t.currentLocation } : null,
      metrics: { ...t.metrics },
      path: t.path ? [...t.path] : [],
    };
  }
}
