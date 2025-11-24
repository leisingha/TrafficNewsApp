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
    status = ReportStatus.PENDING
  ) {
    this.id = id;
    this.type = type;
    this.severity = severity;
    this.location = location;
    this.description = description;
    this.reporterId = reporterId;
    this.timestamp = timestamp;
    this.status = status;
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

  setStatus(status) {
    this.status = status;
  }

  updateDescription(desc) {
    this.description = desc;
  }
}
