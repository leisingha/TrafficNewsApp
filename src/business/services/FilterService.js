import { Filter } from "../models/Filter";

export class FilterService {
  constructor() {
    this.currentFilter = new Filter();
  }

  applyFilter(filter, incidents) {
    this.currentFilter = filter;
    return incidents.filter((incident) => filter.matches(incident));
  }

  clearFilters() {
    this.currentFilter = new Filter();
  }

  filterByType(type, incidents) {
    return incidents.filter((incident) => incident.getType() === type);
  }

  filterBySeverity(severity, incidents) {
    return incidents.filter((incident) => incident.getSeverity() === severity);
  }

  composePredicates(filter) {
    // Returns a function that can be used in Array.filter
    return (incident) => filter.matches(incident);
  }

  getActiveFilter() {
    return this.currentFilter;
  }
}
