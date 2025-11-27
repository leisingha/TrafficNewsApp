import { ReportStatus } from "./Enums";

export class Incident {
  constructor(
    id,
    type,
    severity,
    location,
    description,
    reporterId,
    timestamp = new Date(),
    status = ReportStatus.ACTIVE,
    expiresAt = null
  ) {
    this.id = id;
    this.type = type;
    this.severity = severity;
    this.location = location;
    this.description = description;
    this.reporterId = reporterId;
    this.timestamp = timestamp;
    this.status = status;
    this.expiresAt = expiresAt;
  }

  getId() {
    return this.id;
  }
  getType() {
    return this.type;
  }
  getSeverity() {
    return this.severity;
  }
  getLocation() {
    return this.location;
  }
  getDescription() {
    return this.description;
  }
  getTimestamp() {
    return this.timestamp;
  }
  getStatus() {
    return this.status;
  }

  getExpiresAt() {
    return this.expiresAt;
  }

  setStatus(status) {
    this.status = status;
  }

  setExpiresAt(expiresAt) {
    this.expiresAt = expiresAt;
  }

  updateDescription(desc) {
    this.description = desc;
  }
}
