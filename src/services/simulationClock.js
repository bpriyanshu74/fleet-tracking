export class SimulationClock {
  constructor() {
    this.startTime = null;
    this.simulationStartTime = null;
    this.speedMultiplier = 50; // 50x real-time for faster demo
    this.isRunning = false;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentTime = this.getCurrentSimulationTime();
    this.listeners.forEach((listener) => listener(currentTime));
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = Date.now();

    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  tick = () => {
    if (!this.isRunning) return;

    this.notify();
    requestAnimationFrame(this.tick);
  };

  getCurrentSimulationTime() {
    if (!this.startTime || !this.simulationStartTime) {
      return this.simulationStartTime || Date.now();
    }

    const elapsedRealTime = Date.now() - this.startTime;
    const elapsedSimulatedTime = elapsedRealTime * this.speedMultiplier;
    return this.simulationStartTime + elapsedSimulatedTime;
  }

  setSimulationStartTime(timestamp) {
    this.simulationStartTime = timestamp;
    // console.log(
    //   "Simulation start time set to:",
    //   new Date(timestamp).toISOString()
    // );
  }

  // Get current simulation time as Date object
  getCurrentSimulationDate() {
    return new Date(this.getCurrentSimulationTime());
  }
}
