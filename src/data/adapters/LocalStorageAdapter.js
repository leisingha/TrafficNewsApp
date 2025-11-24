/**
 * LocalStorageAdapter (C09)
 * Handles direct interactions with the browser's LocalStorage.
 */
class LocalStorageAdapter {
  /**
   * Save a value to LocalStorage
   * @param {string} key
   * @param {any} value
   * @returns {boolean} success
   */
  save(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error("Error saving to localStorage", error);
      return false;
    }
  }

  /**
   * Load a value from LocalStorage
   * @param {string} key
   * @returns {any} value or null
   */
  load(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) return null;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error("Error loading from localStorage", error);
      return null;
    }
  }

  /**
   * Remove a value from LocalStorage
   * @param {string} key
   * @returns {boolean} success
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage", error);
      return false;
    }
  }

  /**
   * Clear all data from LocalStorage
   * @returns {boolean} success
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  }

  /**
   * Check if a key exists in LocalStorage
   * @param {string} key
   * @returns {boolean}
   */
  exists(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all items from LocalStorage
   * @returns {Object} key-value pairs
   */
  getAll() {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = this.load(key);
    }
    return items;
  }
}

export default new LocalStorageAdapter();
