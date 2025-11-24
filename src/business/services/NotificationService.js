import { Notification } from "../models/Notification";

export class NotificationService {
  constructor() {
    this.notifications = [];
  }

  notify(message, type = "INFO") {
    const notification = new Notification(message, type);
    this.notifications.push(notification);
    this.showBanner(message);
  }

  showBanner(message) {
    // In a real app, this might trigger a UI toast/snackbar via an event emitter or callback
    console.log(`[NOTIFICATION]: ${message}`);
  }

  dismissAll() {
    this.notifications = [];
  }

  notifyNearbyIncident(incident, route) {
    const message = `New ${incident.getType()} reported on your route: ${route.getName()}`;
    this.notify(message, "WARNING");
  }

  getActiveNotifications() {
    return this.notifications;
  }
}
