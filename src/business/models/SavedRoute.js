export class SavedRoute {
    constructor(id, name, coordinates, userId, isActive = true) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates; // List<Location>
        this.userId = userId;
        this.isActive = isActive;
    }

    getId() { return this.id; }
    getName() { return this.name; }
    getCoordinates() { return this.coordinates; }
    getUserId() { return this.userId; }
    
    isActiveRoute() {
        return this.isActive;
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    containsLocation(location) {
        // Simple implementation: check if location is near any point in the route
        // In a real app, this would use a more complex geometric algorithm (e.g., point-to-line distance)
        const THRESHOLD_KM = 0.5; 
        for (const point of this.coordinates) {
            if (point.distanceTo(location) <= THRESHOLD_KM) {
                return true;
            }
        }
        return false;
    }
}
