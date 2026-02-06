"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Unidade } from "@/types/unidade";
import { Button } from "@/components/ui/button";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}

export default function ReservaMap({
  unidades,
  onUnidadeSelect,
}: {
  unidades: Unidade[];
  onUnidadeSelect: (u: Unidade) => void;
}) {
  const bounds =
    unidades.length > 0
      ? L.latLngBounds(unidades.map((u) => [u.latitude, u.longitude]))
      : L.latLngBounds([[-15.7, -47.8]]);

  return (
    <MapContainer
      className="h-full w-full"
      center={[-15.7942, -47.8822]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ChangeView bounds={bounds} />
      {unidades.map((u) => (
        <Marker
          key={u.id}
          position={[u.latitude, u.longitude]}
          icon={customIcon}
        >
          <Popup className="custom-popup">
            <div className="p-1 text-center">
              <p className="font-bold text-[#472017] mb-2">{u.nome}</p>
              <Button
                size="sm"
                onClick={() => onUnidadeSelect(u)}
                className="bg-[#eea13e] text-white h-7 text-[10px]"
              >
                SELECIONAR ESTA
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
