export class MapPin {
  constructor(incident, location, color) {
    this.incident = incident;
    this.location = location;
    this.color = color;
  }

  getIncident() {
    return this.incident;
  }
  getLocation() {
    return this.location;
  }
  getColor() {
    return this.color;
  }
}
