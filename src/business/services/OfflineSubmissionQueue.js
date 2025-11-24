export class OfflineSubmissionQueue {
  constructor(incidentService) {
    this.queue = [];
    this.isOnlineStatus = navigator.onLine;
    this.incidentService = incidentService;

    // Listen for network status changes
    window.addEventListener("online", () => this.setOnlineStatus(true));
    window.addEventListener("offline", () => this.setOnlineStatus(false));
  }

  enqueue(incident) {
    this.queue.push(incident);
  }

  dequeue() {
    return this.queue.shift();
  }

  async retryAll() {
    if (!this.isOnline()) return;

    const failed = [];
    while (this.queue.length > 0) {
      const incident = this.dequeue();
      try {
        await this.incidentService.create(incident);
      } catch (error) {
        console.error("Failed to sync offline incident:", error);
        failed.push(incident);
      }
    }

    // Re-queue failed attempts
    this.queue = [...failed, ...this.queue];
  }

  isOnline() {
    return this.isOnlineStatus;
  }

  getQueueSize() {
    return this.queue.length;
  }

  clearQueue() {
    this.queue = [];
  }

  setOnlineStatus(status) {
    this.isOnlineStatus = status;
    if (status === true) {
      this.retryAll();
    }
  }
}
