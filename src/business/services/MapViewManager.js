import { MapPin } from '../models/MapPin';

export class MapViewManager {
    constructor(mapServiceAPI) {
        this.mapServiceAPI = mapServiceAPI;
        this.currentViewport = { center: { lat: 0, lng: 0 }, zoom: 13 };
        this.pins = [];
    }

    renderMap(incidents) {
        // Converts incidents to MapPins
        this.pins = incidents.map(incident => this.createPin(incident));
        return this.pins;
    }

    createPin(incident) {
        let color = 'blue';
        switch (incident.getSeverity()) {
            case 'HIGH': color = 'red'; break;
            case 'MEDIUM': color = 'orange'; break;
            case 'LOW': color = 'green'; break;
        }
        return new MapPin(incident, incident.getLocation(), color);
    }

    updateViewport(center, zoom) {
        this.currentViewport = { center, zoom };
    }

    showPopup(incident) {
        // Logic to trigger a popup display (usually returns data for the UI to render)
        return {
            title: incident.getType(),
            content: incident.getDescription(),
            position: incident.getLocation()
        };
    }

    clusterPins(pins) {
        // Placeholder for clustering logic
        // In a real implementation, this would group nearby pins based on zoom level
        return pins; 
    }

    centerOnLocation(location) {
        this.updateViewport(
            { lat: location.getLatitude(), lng: location.getLongitude() },
            this.currentViewport.zoom
        );
    }

    refreshTiles() {
        // Logic to force map tile refresh if needed
        if (this.mapServiceAPI) {
            // this.mapServiceAPI.invalidateSize(); // Example call
        }
    }
}
