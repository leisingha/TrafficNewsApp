import LocalStorageAdapter from "../adapters/LocalStorageAdapter";

const STORAGE_KEY = "traffic_news_incidents";

/**
 * IncidentRepository
 * Handles persistence of Incident entities using LocalStorageAdapter.
 */
class IncidentRepository {
  constructor() {
    this.cache = null;
  }

  /**
   * Fetch all incidents from storage
   * @returns {Promise<Array>} List of incidents
   */
  fetch() {
    if (this.cache) {
      return Promise.resolve(this.cache);
    }
    const data = LocalStorageAdapter.load(STORAGE_KEY);
    this.cache = data || [];
    return Promise.resolve(this.cache);
  }

  /**
   * Persist a new incident
   * @param {Object} incident
   * @returns {Promise<Object>} The persisted incident
   */
  persist(incident) {
    return this.fetch().then((incidents) => {
      // Ensure we don't duplicate if ID exists (though persist usually implies new)
      const existingIndex = incidents.findIndex((i) => i.id === incident.id);
      if (existingIndex >= 0) {
        incidents[existingIndex] = incident;
      } else {
        incidents.push(incident);
      }

      this.cache = incidents;
      LocalStorageAdapter.save(STORAGE_KEY, incidents);
      return incident;
    });
  }

  /**
   * Query incidents based on a filter
   * @param {Object|Function} filter - Filter object or predicate function
   * @returns {Promise<Array>} Filtered incidents
   */
  query(filter) {
    return this.fetch().then((incidents) => {
      if (!filter) return incidents;

      return incidents.filter((item) => {
        // If filter is a function (predicate)
        if (typeof filter === "function") {
          return filter(item);
        }
        // If filter is an object with a matches method (Filter model)
        if (filter && typeof filter.matches === "function") {
          return filter.matches(item);
        }
        return true;
      });
    });
  }

  /**
   * Update an existing incident
   * @param {string} id
   * @param {Object} incident
   * @returns {Promise<boolean>} success
   */
  update(id, incident) {
    return this.fetch().then((incidents) => {
      const index = incidents.findIndex((inc) => inc.id === id);
      if (index !== -1) {
        // Merge existing data with updates
        incidents[index] = { ...incidents[index], ...incident };
        this.cache = incidents;
        LocalStorageAdapter.save(STORAGE_KEY, incidents);
        return true;
      }
      return false;
    });
  }

  /**
   * Delete an incident by ID
   * @param {string} id
   * @returns {Promise<boolean>} success
   */
  delete(id) {
    return this.fetch().then((incidents) => {
      const newIncidents = incidents.filter((inc) => inc.id !== id);
      if (newIncidents.length !== incidents.length) {
        this.cache = newIncidents;
        LocalStorageAdapter.save(STORAGE_KEY, newIncidents);
        return true;
      }
      return false;
    });
  }

  /**
   * Clear the internal memory cache
   */
  clearCache() {
    this.cache = null;
  }
}

export default new IncidentRepository();
