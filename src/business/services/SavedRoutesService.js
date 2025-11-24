export class SavedRoutesService {
  constructor(localStorageAdapter, notificationService) {
    this.localStorageAdapter = localStorageAdapter;
    this.notificationService = notificationService;
    this.STORAGE_KEY = "saved_routes";
  }

  save(route) {
    const routes = this.getAllRoutes();
    routes.push(route);
    this.saveRoutes(routes);
  }

  list(userId) {
    return this.getAllRoutes().filter((r) => r.getUserId() === userId);
  }

  delete(routeId) {
    const routes = this.getAllRoutes();
    const filtered = routes.filter((r) => r.getId() !== routeId);
    if (filtered.length === routes.length) return false;

    this.saveRoutes(filtered);
    return true;
  }

  checkIncidentsNearby(route, incidents) {
    if (!route.isActiveRoute()) return [];

    return incidents.filter((incident) =>
      route.containsLocation(incident.getLocation())
    );
  }

  activateRoute(routeId) {
    this.toggleRouteStatus(routeId, true);
  }

  deactivateRoute(routeId) {
    this.toggleRouteStatus(routeId, false);
  }

  // Helper methods
  getAllRoutes() {
    // In a real app, we'd need to deserialize JSON back to SavedRoute objects
    // For now, we assume the adapter handles basic JSON parsing
    const raw = this.localStorageAdapter.load(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  saveRoutes(routes) {
    this.localStorageAdapter.save(this.STORAGE_KEY, JSON.stringify(routes));
  }

  toggleRouteStatus(routeId, isActive) {
    const routes = this.getAllRoutes();
    const route = routes.find((r) => r.id === routeId); // Accessing raw property for now
    if (route) {
      route.isActive = isActive;
      this.saveRoutes(routes);
    }
  }
}
