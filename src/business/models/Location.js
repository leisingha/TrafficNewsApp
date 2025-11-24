export class Location {
  constructor(latitude, longitude, address = "", city = "") {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.city = city;
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }

  getAddress() {
    return this.address;
  }

  getCity() {
    return this.city;
  }

  setAddress(address) {
    this.address = address;
  }

  distanceTo(otherLocation) {
    // Haversine formula implementation
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(otherLocation.latitude - this.latitude);
    const dLon = this.deg2rad(otherLocation.longitude - this.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this.latitude)) *
        Math.cos(this.deg2rad(otherLocation.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
