export class RefreshScheduler {
  constructor() {
    this.intervalSeconds = 30; // Default 30 seconds
    this.timerId = null;
    this.callback = null;
  }

  start(callback) {
    this.stop(); // Ensure no existing timer
    this.callback = callback;
    this.timerId = setInterval(() => {
      this.trigger();
    }, this.intervalSeconds * 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  setInterval(seconds) {
    this.intervalSeconds = seconds;
    if (this.isRunning()) {
      // Restart with new interval
      this.start(this.callback);
    }
  }

  getInterval() {
    return this.intervalSeconds;
  }

  trigger() {
    if (this.callback) {
      this.callback();
    }
  }

  isRunning() {
    return this.timerId !== null;
  }
}
