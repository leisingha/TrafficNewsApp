import { IncidentType, SeverityLevel } from "../models/Enums";
import { ValidationResult } from "../models/ValidationResult";

export class ValidationService {
  constructor() {
    this.requiredFields = [
      "type",
      "severity",
      "location",
      "description",
      "reporterId",
    ];
  }

  validateReport(incident) {
    const result = new ValidationResult(true);

    // Check required fields
    const missingFields = this.checkRequiredFields(incident);
    if (missingFields.length > 0) {
      result.addError(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate specific fields
    if (!this.validateIncidentType(incident.getType())) {
      result.addFieldError("type", "Invalid incident type");
    }

    if (!this.validateSeverity(incident.getSeverity())) {
      result.addFieldError("severity", "Invalid severity level");
    }

    const locationValidation = this.validateLocation(incident.getLocation());
    if (!locationValidation.isValid) {
      result.addFieldError("location", locationValidation.error);
    }

    if (incident.getDescription() && incident.getDescription().length < 10) {
      result.addFieldError(
        "description",
        "Description must be at least 10 characters long"
      );
    }

    return result;
  }

  validateLocation(location) {
    if (!location) {
      return { isValid: false, error: "Location is required" };
    }

    if (
      typeof location.getLatitude() !== "number" ||
      typeof location.getLongitude() !== "number"
    ) {
      return { isValid: false, error: "Invalid coordinates" };
    }

    if (location.getLatitude() < -90 || location.getLatitude() > 90) {
      return { isValid: false, error: "Latitude must be between -90 and 90" };
    }

    if (location.getLongitude() < -180 || location.getLongitude() > 180) {
      return {
        isValid: false,
        error: "Longitude must be between -180 and 180",
      };
    }

    return { isValid: true };
  }

  checkRequiredFields(incident) {
    const missing = [];
    if (!incident.getType()) missing.push("type");
    if (!incident.getSeverity()) missing.push("severity");
    if (!incident.getLocation()) missing.push("location");
    if (!incident.getDescription()) missing.push("description");
    if (!incident.reporterId) missing.push("reporterId");
    return missing;
  }

  validateIncidentType(type) {
    return Object.values(IncidentType).includes(type);
  }

  validateSeverity(severity) {
    return Object.values(SeverityLevel).includes(severity);
  }

  validateUser(user) {
    return user && user.getId() && user.getUsername();
  }
}
