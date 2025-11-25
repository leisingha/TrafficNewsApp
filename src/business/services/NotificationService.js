import { Notification } from "../models/Notification";

export class NotificationService {
  constructor() {
    this.notifications = [];
    this.notificationHandler = null;
  }

  setNotificationHandler(handler) {
    this.notificationHandler = handler;
  }

  notify(message, type = "INFO") {
    const notification = new Notification(message, type);
    this.notifications.push(notification);
    this.showBanner(message, type);
  }

  showBanner(message, type = "INFO") {
    // In a real app, this might trigger a UI toast/snackbar via an event emitter or callback
    console.log(`[NOTIFICATION]: ${message}`);
    if (this.notificationHandler) {
      this.notificationHandler(message, type);
    }
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
