export class SearchService {
    constructor() {
        this.searchIndex = new Map();
    }

    searchByKeyword(keyword, incidents) {
        if (!keyword || keyword.trim() === '') {
            return incidents;
        }
        const term = keyword.toLowerCase();
        return incidents.filter(incident => {
            const desc = incident.getDescription().toLowerCase();
            const addr = incident.getLocation().getAddress().toLowerCase();
            const city = incident.getLocation().getCity().toLowerCase();
            return desc.includes(term) || addr.includes(term) || city.includes(term);
        });
    }

    searchByLocation(location, incidents) {
        // Simple implementation: find incidents within a certain radius (e.g., 5km)
        const RADIUS_KM = 5;
        return incidents.filter(incident => 
            incident.getLocation().distanceTo(location) <= RADIUS_KM
        );
    }

    searchByDescription(text, incidents) {
        const term = text.toLowerCase();
        return incidents.filter(incident => 
            incident.getDescription().toLowerCase().includes(term)
        );
    }

    buildSearchIndex(incidents) {
        // In a real app, this might build a trie or inverted index for faster lookup
        // For now, we'll just store the list for potential optimization
        this.searchIndex.clear();
        incidents.forEach(incident => {
            this.searchIndex.set(incident.getId(), incident);
        });
    }

    clearIndex() {
        this.searchIndex.clear();
    }
}
