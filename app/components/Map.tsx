"use client";
import React, { useId, useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// @ts-expect-error: Removing default icon URL which is not bundled in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  center?: number[];
}

interface LeafletContainer extends HTMLElement {
  _leaflet_id?: number | null;
}

const Map: React.FC<MapProps> = ({ center }) => {
  // Generate a unique id for this component instance
  const generatedId = useId();
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    return () => {
      // Remove the Leaflet map instance if it exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // Additionally, clear the _leaflet_id on the container element
      const container = document.getElementById(
        `map-container-${generatedId}`
      ) as LeafletContainer | null;
      if (container && container._leaflet_id) {
        container._leaflet_id = null;
      }
    };
  }, [generatedId]);
  if (!center) return null;

  return (
    <MapContainer
      id={`map-container-${generatedId}`}
      key={center ? center.toString() : "default"}
      center={(center as L.LatLngExpression) || [51, -0.09]}
      zoom={center ? 4 : 2}
      scrollWheelZoom={false}
      className="h-[35vh] rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && <Marker position={center as L.LatLngExpression} />}
    </MapContainer>
  );
};

export default Map;
