/**
 * MapServiceAPI
 * Adapter for external Map and Geocoding APIs.
 * Uses OpenStreetMap (Nominatim) and OSRM for demonstration.
 */
class MapServiceAPI {
  constructor() {
    this.nominatimUrl = "https://nominatim.openstreetmap.org";
    this.osrmUrl = "https://router.project-osrm.org";
  }

  /**
   * Get tile layer URL template
   * @returns {string} URL template for Leaflet
   */
  getTiles() {
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }

  /**
   * Geocode an address to coordinates
   * @param {string} address
   * @returns {Promise<Array>} List of locations
   */
  async geocode(address) {
    try {
      const response = await fetch(
        `${this.nominatimUrl}/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (!response.ok) throw new Error("Geocoding failed");
      const data = await response.json();
      return data.map((item) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        displayName: item.display_name,
        address: item.display_name, // Mapping display_name to address for consistency
      }));
    } catch (error) {
      console.error("Geocode error", error);
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to an address
   * @param {Object} location - { latitude, longitude }
   * @returns {Promise<string>} Address string
   */
  async reverseGeocode(location) {
    try {
      const { latitude, longitude } = location;
      const response = await fetch(
        `${this.nominatimUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error("Reverse geocoding failed");
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error("Reverse geocode error", error);
      return null;
    }
  }

  /**
   * Get a route between two points
   * @param {Object} start - { latitude, longitude }
   * @param {Object} end - { latitude, longitude }
   * @returns {Promise<Object>} GeoJSON geometry of the route
   */
  async getRoute(start, end) {
    try {
      // OSRM expects longitude,latitude
      const url = `${this.osrmUrl}/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Routing failed");
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry;
      }
      return null;
    } catch (error) {
      console.error("Get route error", error);
      return null;
    }
  }

  /**
   * Check if the map service is available (online)
   * @returns {boolean}
   */
  isAvailable() {
    return navigator.onLine;
  }
}

export default new MapServiceAPI();
