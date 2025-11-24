export class Filter {
    constructor(types = [], severities = [], keywords = '') {
        this.types = types; // List<IncidentType>
        this.severities = severities; // List<SeverityLevel>
        this.keywords = keywords; // String
    }

    getTypes() { return this.types; }
    getSeverities() { return this.severities; }
    getKeywords() { return this.keywords; }

    setTypes(types) { this.types = types; }
    setSeverities(severities) { this.severities = severities; }
    setKeywords(keywords) { this.keywords = keywords; }

    matches(incident) {
        const typeMatch = this.types.length === 0 || this.types.includes(incident.getType());
        const severityMatch = this.severities.length === 0 || this.severities.includes(incident.getSeverity());
        
        let keywordMatch = true;
        if (this.keywords && this.keywords.trim() !== '') {
            const term = this.keywords.toLowerCase();
            const desc = incident.getDescription().toLowerCase();
            const addr = incident.getLocation().getAddress().toLowerCase();
            keywordMatch = desc.includes(term) || addr.includes(term);
        }

        return typeMatch && severityMatch && keywordMatch;
    }
}
