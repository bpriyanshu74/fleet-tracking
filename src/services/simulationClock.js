export class SimulationClock {
  constructor(speed = 50) {
    this.speed = speed;
    this.listeners = new Set();
    this.isRunning = false;
    this.simulationStartTime = null;
    this.lastUpdateTime = null;
    this.currentSimulationTime = null;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setSimulationStartTime(realTimestamp) {
    this.simulationStartTime = realTimestamp;
    this.currentSimulationTime = realTimestamp;
    this.lastUpdateTime = Date.now();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastUpdateTime = Date.now();

    const tick = () => {
      if (!this.isRunning) return;

      const now = Date.now();
      const realDelta = now - this.lastUpdateTime;

      const simulatedDelta = realDelta * this.speed;

      this.currentSimulationTime += simulatedDelta;
      this.lastUpdateTime = now;

      this.notify(this.currentSimulationTime);

      requestAnimationFrame(tick);
    };

    tick();
  }

  stop() {
    this.isRunning = false;
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify(time) {
    this.listeners.forEach((cb) => cb(time));
  }
}
