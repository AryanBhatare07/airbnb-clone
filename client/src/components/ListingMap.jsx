import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function ListingMap({ coordinates, location }) {
  if (!coordinates || coordinates.lat == null || coordinates.lng == null) {
    return <p>Map location not available.</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        marginTop: "16px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default ListingMap;
