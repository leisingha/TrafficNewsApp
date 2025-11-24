import React, { useEffect } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapContainer = ({ incidents }) => {
  // Default center (Toronto)
  const defaultCenter = [43.6532, -79.3832];

  return (
    <LeafletMap
      center={defaultCenter}
      zoom={11}
      style={{
        height: "500px",
        width: "100%",
        marginTop: "16px",
        borderRadius: "8px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident) => {
        const { latitude, longitude } = incident.location;
        if (!latitude || !longitude) return null;

        return (
          <Marker key={incident.id} position={[latitude, longitude]}>
            <Popup>
              <strong>{incident.type}</strong>
              <br />
              Severity: {incident.severity}
              <br />
              {incident.description}
              <br />
              <small>{incident.location.address}</small>
            </Popup>
          </Marker>
        );
      })}
    </LeafletMap>
  );
};

export default MapContainer;
