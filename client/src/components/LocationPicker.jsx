import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultPosition = [20.5937, 78.9629];

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 22px;
    height: 22px;
    background: #f43f5e;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);

  return null;
}

function LocationPicker({ coordinates, onChange, searchQuery }) {
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const hasCoordinates =
    coordinates.lat !== "" &&
    coordinates.lng !== "" &&
    Number.isFinite(Number(coordinates.lat)) &&
    Number.isFinite(Number(coordinates.lng));

  const position = hasCoordinates
    ? [Number(coordinates.lat), Number(coordinates.lng)]
    : defaultPosition;

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter location and country first.");
      return;
    }

    try {
      setSearching(true);
      setSearchError("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const data = await response.json();

      if (data.length === 0) {
        setSearchError("Location not found. Try another address.");
        return;
      }

      onChange({
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
      });
    } catch (error) {
      setSearchError(error.message || "Unable to find location.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="md:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="font-medium text-sm">Property Location on Map</h3>
          <p className="text-xs text-gray-500 mt-1">
            Search your address or click on the map to select the location.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
        >
          {searching ? "Searching..." : "Find Location"}
        </button>
      </div>

      {searchError && (
        <p className="text-sm text-red-500 mb-2">{searchError}</p>
      )}

      <div className="h-80 w-full rounded-xl overflow-hidden border">
        <MapContainer
          center={position}
          zoom={hasCoordinates ? 13 : 4}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater position={position} />

          <MapClickHandler onSelect={onChange} />

          {hasCoordinates && (
            <Marker
              position={position}
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const newPosition = marker.getLatLng();

                  onChange({
                    lat: newPosition.lat,
                    lng: newPosition.lng,
                  });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        {hasCoordinates
          ? `Selected coordinates: ${Number(coordinates.lat).toFixed(5)}, ${Number(coordinates.lng).toFixed(5)}`
          : "No location selected yet."}
      </p>
    </div>
  );
}

export default LocationPicker;
