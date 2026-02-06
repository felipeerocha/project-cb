"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: typeof iconUrl === "string" ? iconUrl : iconUrl.src,
  iconRetinaUrl:
    typeof iconRetinaUrl === "string" ? iconRetinaUrl : iconRetinaUrl.src,
  shadowUrl: typeof shadowUrl === "string" ? shadowUrl : shadowUrl.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  const map = useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      onLocationSelect(newPos.lat, newPos.lng);
      map.flyTo(e.latlng, 16);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={DefaultIcon} />
  );
}

function MapController({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

interface LocationPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationPicker({
  initialLat,
  initialLng,
  onLocationSelect,
}: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const defaultCenter = { lat: -15.7942, lng: -47.8822 };
  const center = position || defaultCenter;

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-50">
      <MapContainer
        center={center}
        zoom={position ? 16 : 4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
        <MapController coords={position} />
      </MapContainer>

      {!position && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-black/10 text-xs font-bold text-gray-600 pointer-events-none flex items-center gap-2">
          <MapPin size={14} className="text-[#eea13e]" />
          Use o CEP ou clique para marcar
        </div>
      )}
    </div>
  );
}
