import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAppContext } from "../AllContext/AllContext";

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684813.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

function TripMap({ TripData }) {
  const { url, token, user, getUserInformation } = useAppContext();

  useEffect(() => {
    getUserInformation();
  }, [getUserInformation]);

  if (!TripData) {
    return <p className="text-center text-xl font-semibold text-gray-600">No trip data available.</p>;
  }

  const { trip, users } = TripData;
  const isHost = user?._id === trip.userId;
  const hasValidCoords = trip.originCoords?.length === 2 && trip.destinationCoords?.length === 2;

  const handleCancelTrip = async () => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    try {
      const response = await fetch(`${url}/api/trips/cancel/${trip._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to cancel trip");

      alert("Trip canceled successfully!");
    } catch (error) {
      console.error("Error canceling trip:", error);
      alert("Error: " + error.message);
    }
  };

  const handleLeaveTrip = async () => {
    if (!window.confirm("Are you sure you want to leave this trip?")) return;

    try {
      const response = await fetch(`${url}/api/trips/leave/${trip._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) throw new Error("Failed to leave trip");

      alert("You have left the trip successfully!");
    } catch (error) {
      console.error("Error leaving trip:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Map Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">🗺️ Trip Route</h2>
        {hasValidCoords ? (
          <div className="w-full h-96 min-h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[trip.originCoords[1], trip.originCoords[0]]}
              zoom={6}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Origin Marker */}
              <Marker position={[trip.originCoords[1], trip.originCoords[0]]} icon={startIcon}>
                <Popup>Start: {trip.origin}</Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={[trip.destinationCoords[1], trip.destinationCoords[0]]} icon={endIcon}>
                <Popup>Destination: {trip.destination}</Popup>
              </Marker>

              {/* Route Polyline */}
              <Polyline
                positions={[
                  [trip.originCoords[1], trip.originCoords[0]],
                  [trip.destinationCoords[1], trip.destinationCoords[0]],
                ]}
                color="blue"
              />
            </MapContainer>
          </div>
        ) : (
          <p className="text-center text-red-500">⚠️ Invalid or missing coordinates.</p>
        )}
      </div>

      {/* Trip Details Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">📝 Trip Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p><strong>📍 Origin:</strong> {trip.origin}</p>
          <p><strong>🏁 Destination:</strong> {trip.destination}</p>
          <p><strong>📍 Pickup Point:</strong> {trip.pickupPoint}</p>
          <p><strong>📅 Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
          <p><strong>⏰ Time:</strong> {trip.time}</p>
          <p><strong>🚗 Vehicle:</strong> {trip.vehicle}</p>
          <p><strong>💰 Price Per Seat:</strong> ${trip.pricePerSeat}</p>
          <p><strong>🪑 Seats Available:</strong> {trip.seatsAvailable}</p>
          <p><strong>📜 Description:</strong> {trip.description}</p>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">👥 Passengers</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((u) => (
              <div key={u._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center space-x-4">
                <img
                  src={u.profileImage ? `${url}/${u.profileImage}` : "/default-avatar.png"}
                  alt={u.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{u.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{u.email}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${u.host ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}>
                    {u.host ? "Host" : "Passenger"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No passengers found.</p>
        )}
      </div>
    </div>
  );
}

export default TripMap;
