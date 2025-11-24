export class Notification {
  constructor(message, type, timestamp = new Date()) {
    this.message = message;
    this.type = type; // 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
    this.timestamp = timestamp;
  }

  getMessage() {
    return this.message;
  }
  getType() {
    return this.type;
  }
  getTimestamp() {
    return this.timestamp;
  }
}
