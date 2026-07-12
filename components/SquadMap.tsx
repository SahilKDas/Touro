"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Person = { id: string; name: string; role: string; initials: string; color: string; lat: number; lng: number; you?: boolean };
type Venue = { id: string; label: string; sub: string; kind: "field" | "hotel" | "food" | "parking" | "hq"; lat: number; lng: number };

const CENTER: [number, number] = [33.8025, -117.9228];

const people: Person[] = [
  { id: "sk", name: "Sahil", role: "You", initials: "SK", color: "#b8860b", lat: 33.8027, lng: -117.9226, you: true },
  { id: "mr", name: "Maya", role: "Player · #7", initials: "MR", color: "#f97316", lat: 33.8033, lng: -117.9234 },
  { id: "jl", name: "Jordan", role: "Player · #12", initials: "JL", color: "#0f9f75", lat: 33.8018, lng: -117.9219 },
  { id: "p4", name: "+7 more squad members", role: "Sharing location", initials: "+7", color: "#102a43", lat: 33.8022, lng: -117.9212 },
];

const venues: Venue[] = [
  { id: "f4", label: "Field 4", sub: "Pool Game 3 · Final", kind: "field", lat: 33.8031, lng: -117.9238 },
  { id: "f7", label: "Field 7", sub: "Semifinal · 1:00 PM", kind: "field", lat: 33.8015, lng: -117.9214 },
  { id: "stadium", label: "Stadium Field", sub: "Championship · If advanced", kind: "field", lat: 33.8009, lng: -117.9237 },
  { id: "hampton", label: "Hampton Inn & Suites", sub: "0.3 mi · $189/night · 6 squad families", kind: "hotel", lat: 33.8038, lng: -117.9241 },
  { id: "courtyard", label: "Courtyard by Marriott", sub: "0.6 mi · $215/night · 3 squad families", kind: "hotel", lat: 33.8044, lng: -117.9219 },
  { id: "bestwestern", label: "Best Western Plus", sub: "0.9 mi · $149/night · 2 squad families", kind: "hotel", lat: 33.7998, lng: -117.9256 },
  { id: "residenceinn", label: "Residence Inn by Marriott", sub: "1.0 mi · $199/night · 4 squad families", kind: "hotel", lat: 33.8055, lng: -117.9255 },
  { id: "holidayinn", label: "Holiday Inn Express", sub: "1.2 mi · $159/night · 3 squad families", kind: "hotel", lat: 33.7985, lng: -117.9225 },
  { id: "hiltongarden", label: "Hilton Garden Inn", sub: "0.8 mi · $229/night · 5 squad families", kind: "hotel", lat: 33.8035, lng: -117.92 },
  { id: "laquinta", label: "La Quinta Inn & Suites", sub: "1.4 mi · $129/night · 2 squad families", kind: "hotel", lat: 33.7975, lng: -117.927 },
  { id: "springhill", label: "SpringHill Suites by Marriott", sub: "0.7 mi · $209/night · 3 squad families", kind: "hotel", lat: 33.8042, lng: -117.9203 },
  { id: "homewood", label: "Homewood Suites by Hilton", sub: "1.1 mi · $219/night · 2 squad families", kind: "hotel", lat: 33.7988, lng: -117.9208 },
  { id: "extendedstay", label: "Extended Stay America", sub: "1.6 mi · $139/night · 1 squad family", kind: "hotel", lat: 33.8065, lng: -117.9265 },
  { id: "motel6", label: "Motel 6", sub: "1.8 mi · $89/night · 1 squad family", kind: "hotel", lat: 33.7955, lng: -117.9285 },
  { id: "tacomesa", label: "Taco Mesa", sub: "Team lunch · Table for 12", kind: "food", lat: 33.802, lng: -117.9244 },
  { id: "fieldhouse", label: "Fieldhouse Café", sub: "Coffee · Sandwiches · 0.7 mi", kind: "food", lat: 33.804, lng: -117.921 },
  { id: "parkside", label: "Parkside Grill", sub: "American · Patio · 1.1 mi", kind: "food", lat: 33.8007, lng: -117.9203 },
  { id: "pizzapress", label: "Pizza Press", sub: "Build your own · 0.5 mi", kind: "food", lat: 33.8018, lng: -117.9255 },
  { id: "innout", label: "In-N-Out Burger", sub: "Burgers · 1.3 mi", kind: "food", lat: 33.799, lng: -117.9195 },
  { id: "panera", label: "Panera Bread", sub: "Sandwiches · Bakery-café · 0.6 mi", kind: "food", lat: 33.8048, lng: -117.9235 },
  { id: "sushiboat", label: "Sushi Boat", sub: "Japanese · Sushi · 1.5 mi", kind: "food", lat: 33.797, lng: -117.921 },
  { id: "chickfila", label: "Chick-fil-A", sub: "Chicken · Fast food · 0.5 mi", kind: "food", lat: 33.8005, lng: -117.9265 },
  { id: "olivegarden", label: "Olive Garden", sub: "Italian · Sit-down · 1.2 mi", kind: "food", lat: 33.7965, lng: -117.9245 },
  { id: "starbucks", label: "Starbucks", sub: "Coffee · 0.3 mi", kind: "food", lat: 33.8032, lng: -117.9218 },
  { id: "habit", label: "The Habit Burger Grill", sub: "Burgers · Fast casual · 0.9 mi", kind: "food", lat: 33.8058, lng: -117.9225 },
  { id: "parking", label: "Lot C Parking", sub: "5 min walk · $10/day", kind: "parking", lat: 33.8012, lng: -117.9247 },
  { id: "hq", label: "Tournament HQ · First Aid", sub: "Field 1 entrance", kind: "hq", lat: 33.8028, lng: -117.9231 },
];

const VENUE_META: Record<Venue["kind"], { color: string; glyph: string }> = {
  field: { color: "#0f9f75", glyph: "🏟" },
  hotel: { color: "#334e68", glyph: "🏨" },
  food: { color: "#f97316", glyph: "🌮" },
  parking: { color: "#b8860b", glyph: "🅿️" },
  hq: { color: "#dc2626", glyph: "⛑️" },
};

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function RouteLine({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds([from, to], { padding: [70, 70], maxZoom: 16 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from[0], from[1], to[0], to[1]]);

  return (
    <>
      <Polyline positions={[from, to]} pathOptions={{ color: "#ffffff", weight: 9, opacity: 0.9, lineCap: "round" }} />
      <Polyline positions={[from, to]} pathOptions={{ color: "#007aff", weight: 5, opacity: 0.95, lineCap: "round" }} />
    </>
  );
}

function personIcon(p: Person) {
  const pulse = p.you
    ? `<div style="position:absolute;inset:-7px;border-radius:50%;border:2px solid ${p.color};animation:touro-map-ping 1.7s ease-out infinite;"></div>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:32px;height:32px;">
      ${pulse}
      <div style="width:32px;height:32px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${p.color};border:2.5px solid #fff;box-shadow:0 3px 10px rgba(16,32,54,.35);display:flex;align-items:center;justify-content:center;">
        <span style="display:block;transform:rotate(45deg);color:#fff;font-size:10px;font-weight:700;font-family:system-ui,sans-serif;">${p.initials}</span>
      </div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -30],
  });
}

function venueIcon(v: Venue) {
  const meta = VENUE_META[v.kind];
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${meta.color};border:2px solid #fff;box-shadow:0 3px 8px rgba(16,32,54,.3);display:flex;align-items:center;justify-content:center;">
      <span style="display:block;transform:rotate(45deg);font-size:12px;line-height:1;">${meta.glyph}</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 26],
    popupAnchor: [0, -26],
  });
}

function LocateControl() {
  const map = useMap();
  const [busy, setBusy] = useState(false);

  function locate() {
    if (!navigator.geolocation) return;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { animate: true, duration: 1.1 });
        setBusy(false);
      },
      () => setBusy(false),
      { timeout: 8000 },
    );
  }

  return (
    <div className="leaflet-top leaflet-right touro-map-control" style={{ marginTop: 54 }}>
      <div className="leaflet-control leaflet-bar touro-map-btn">
        <a role="button" title="Center on me" onClick={locate} className={busy ? "busy" : ""}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function SatelliteToggle({ satellite, onToggle }: { satellite: boolean; onToggle: () => void }) {
  return (
    <div className="leaflet-top leaflet-right touro-map-control" style={{ marginTop: 92 }}>
      <div className="leaflet-control leaflet-bar touro-map-btn">
        <a role="button" title={satellite ? "Street view" : "Satellite view"} onClick={(e) => { e.preventDefault(); onToggle(); }}>
          {satellite ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18" /><path d="M12 3a15 15 0 0 0 0 18" /></svg>
          )}
        </a>
      </div>
    </div>
  );
}

const TILES = {
  street: { url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", attr: "&copy; CARTO" },
  satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "Tiles &copy; Esri" },
};

export default function SquadMap({
  expanded = false,
  onVenueSelect,
  directionsTo,
  onDirections,
  onClearDirections,
}: {
  expanded?: boolean;
  onVenueSelect?: (id: string) => void;
  directionsTo?: string | null;
  onDirections?: (id: string) => void;
  onClearDirections?: () => void;
}) {
  const [tile, setTile] = useState<"street" | "satellite">("street");
  const you = people.find((p) => p.you);
  const target = directionsTo ? venues.find((v) => v.id === directionsTo) : undefined;
  const distanceMi = you && target ? haversineMiles(you.lat, you.lng, target.lat, target.lng) : null;

  return (
    <div className={`squad-map ${expanded ? "expanded" : ""}`}>
      {target && distanceMi !== null && (
        <div className="map-directions-banner">
          <span>Directions to <strong>{target.label}</strong> · {distanceMi.toFixed(1)} mi</span>
          {onClearDirections && <button onClick={onClearDirections} aria-label="Clear directions">✕</button>}
        </div>
      )}
      <MapContainer
        center={CENTER}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={expanded}
        attributionControl={false}
      >
        <TileLayer key={tile} url={TILES[tile].url} attribution={TILES[tile].attr} />
        <ZoomControl position="topright" />
        <LocateControl />
        <SatelliteToggle satellite={tile === "satellite"} onToggle={() => setTile((t) => (t === "street" ? "satellite" : "street"))} />
        {you && target && <RouteLine from={[you.lat, you.lng]} to={[target.lat, target.lng]} />}
        {venues.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={venueIcon(v)}>
            <Popup>
              <strong>{v.label}</strong><br />{v.sub}
              {(v.kind === "hotel" || v.kind === "food") && onVenueSelect && (
                <><br /><button className="map-popup-btn" onClick={() => onVenueSelect(v.id)}>View details →</button></>
              )}
              {onDirections && (
                <><br /><button className="map-popup-btn" onClick={() => onDirections(v.id)}>Directions →</button></>
              )}
            </Popup>
          </Marker>
        ))}
        {people.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={personIcon(p)}>
            <Popup><strong>{p.name}</strong><br />{p.role}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
