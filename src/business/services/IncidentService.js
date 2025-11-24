import { Incident } from "../models/Incident";

export class IncidentService {
  constructor(incidentRepository, validationService) {
    this.incidentRepository = incidentRepository;
    this.validationService = validationService;
  }

  async getAll() {
    return await this.incidentRepository.fetch();
  }

  async getById(id) {
    const incidents = await this.getAll();
    return incidents.find((inc) => inc.getId() === id);
  }

  async create(incident) {
    const validation = this.validationService.validateReport(incident);
    if (!validation.isValidResult()) {
      throw new Error(
        `Validation failed: ${validation.getErrors().join(", ")}`
      );
    }

    await this.incidentRepository.persist(incident);
    return incident;
  }

  async update(id, incidentData) {
    // In a real app, we'd fetch, merge, validate, then save
    // For now, we assume incidentData is a full Incident object or partial update
    await this.incidentRepository.update(id, incidentData);
  }

  async delete(id) {
    await this.incidentRepository.delete(id);
    return true;
  }

  sortByTime(incidents, ascending = false) {
    return [...incidents].sort((a, b) => {
      const timeA = new Date(a.getTimestamp()).getTime();
      const timeB = new Date(b.getTimestamp()).getTime();
      return ascending ? timeA - timeB : timeB - timeA;
    });
  }

  sortBySeverity(incidents, ascending = false) {
    const severityWeight = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    return [...incidents].sort((a, b) => {
      const weightA = severityWeight[a.getSeverity()] || 0;
      const weightB = severityWeight[b.getSeverity()] || 0;
      return ascending ? weightA - weightB : weightB - weightA;
    });
  }

  sortByDistance(incidents, location) {
    return [...incidents].sort((a, b) => {
      const distA = a.getLocation().distanceTo(location);
      const distB = b.getLocation().distanceTo(location);
      return distA - distB;
    });
  }

  filterBy(incidents, filter) {
    return incidents.filter((incident) => filter.matches(incident));
  }

  async refresh() {
    this.incidentRepository.clearCache();
    return await this.getAll();
  }
}
