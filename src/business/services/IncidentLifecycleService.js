import { IncidentType, ReportStatus } from "../models/Enums";

const HOURS_TO_MS = 3600000;
const DEFAULT_EXPIRY_BY_TYPE = {
  [IncidentType.ACCIDENT]: 12,
  [IncidentType.CONSTRUCTION]: 72,
  [IncidentType.CLOSURE]: 48,
  [IncidentType.HAZARD]: 6,
  [IncidentType.TRAFFIC_JAM]: 8,
  DEFAULT: 24,
};

const ACTIVE_STATUSES = new Set([
  ReportStatus.ACTIVE,
  ReportStatus.PENDING,
  ReportStatus.APPROVED,
  ReportStatus.NEEDS_CHANGES,
]);

const TERMINAL_STATUSES = new Set([
  ReportStatus.RESOLVED,
  ReportStatus.EXPIRED,
  ReportStatus.REJECTED,
]);

export class IncidentLifecycleService {
  constructor(incidentRepository, notificationService) {
    this.incidentRepository = incidentRepository;
    this.notificationService = notificationService;
  }

  getExpiryHours(type) {
    return DEFAULT_EXPIRY_BY_TYPE[type] || DEFAULT_EXPIRY_BY_TYPE.DEFAULT;
  }

  ensureExpiresAt(incident) {
    if (incident.expiresAt) {
      return incident;
    }
    const baseTimestamp = incident.timestamp || new Date().toISOString();
    const expiryMs = new Date(baseTimestamp).getTime() + this.getExpiryHours(incident.type) * HOURS_TO_MS;
    return { ...incident, expiresAt: new Date(expiryMs).toISOString() };
  }

  async syncExpiryMetadata(incident) {
    if (incident.expiresAt) {
      return incident;
    }
    const withExpiry = this.ensureExpiresAt(incident);
    await this.incidentRepository.update(incident.id, {
      expiresAt: withExpiry.expiresAt,
    });
    return withExpiry;
  }

  isExpired(incident) {
    if (!incident.expiresAt) {
      return false;
    }
    return new Date(incident.expiresAt).getTime() <= Date.now();
  }

  async expireStaleIncidents() {
    const incidents = await this.incidentRepository.fetch();
    let expiredCount = 0;
    let reactivatedCount = 0;

    for (const incident of incidents) {
      const hydrated = await this.syncExpiryMetadata(incident);
      const status = hydrated.status || ReportStatus.ACTIVE;
      const expired = this.isExpired(hydrated);
      const treatAsActive = ACTIVE_STATUSES.has(status);

      if (expired && treatAsActive) {
        expiredCount += 1;
        await this.incidentRepository.update(hydrated.id, {
          status: ReportStatus.EXPIRED,
          expiredAt: new Date().toISOString(),
        });
      } else if (!expired && status === ReportStatus.EXPIRED) {
        reactivatedCount += 1;
        await this.incidentRepository.update(hydrated.id, {
          status: ReportStatus.ACTIVE,
          expiredAt: null,
        });
      } else if (!expired && !treatAsActive && !TERMINAL_STATUSES.has(status)) {
        // Older statuses (e.g., APPROVED) should still behave like active.
        reactivatedCount += 1;
        await this.incidentRepository.update(hydrated.id, {
          status: ReportStatus.ACTIVE,
        });
      }
    }

    if (expiredCount > 0) {
      this.notificationService.notify(
        `${expiredCount} incident${expiredCount > 1 ? "s" : ""} expired automatically`,
        "INFO"
      );
    }
    return { expired: expiredCount, reactivated: reactivatedCount };
  }

  async markResolved(incidentId) {
    await this.incidentRepository.update(incidentId, {
      status: ReportStatus.RESOLVED,
      resolvedAt: new Date().toISOString(),
    });
  }

  async extendIncident(incidentId, hoursToAdd) {
    const incidents = await this.incidentRepository.fetch();
    const target = incidents.find((inc) => inc.id === incidentId);
    if (!target) {
      throw new Error("Incident not found");
    }
    const baseDate = target.expiresAt ? new Date(target.expiresAt) : new Date(target.timestamp);
    const updatedExpiry = new Date(baseDate.getTime() + hoursToAdd * HOURS_TO_MS).toISOString();

    await this.incidentRepository.update(incidentId, {
      expiresAt: updatedExpiry,
      status: ReportStatus.ACTIVE,
    });

    return updatedExpiry;
  }
}
