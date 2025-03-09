import React, { useState, useEffect } from "react";
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
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684813.png", // Different icon for destination
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

function TripMap() {
  const { url, token, user, getUserInformation } = useAppContext(); // Get logged-in user
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserTrip = async () => {
    try {
      const response = await fetch(`${url}/api/trips/get-user-trip`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch user trips");
      }

      const data = await response.json();
      setTripData(data);
    } catch (error) {
      console.error("Error fetching user trips:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTrip();
    getUserInformation();
  }, [url, token]); // Dependencies added

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600 animate-spin">🌀 Loading map...</p>
      </div>
    );
  }

  if (!tripData) {
    return <p className="text-center text-xl font-semibold text-gray-600">No trip data available.</p>;
  }

  const { trip, users } = tripData;
  const isHost = user?._id === trip.userId; // ✅ Corrected host check

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

      if (!response.ok) {
        throw new Error("Failed to cancel trip");
      }

      alert("Trip canceled successfully!");
      setTripData(null); // Remove trip from UI
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

      if (!response.ok) {
        throw new Error("Failed to leave trip");
      }

      alert("You have left the trip successfully!");
      setTripData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== user._id),
      }));
    } catch (error) {
      console.error("Error leaving trip:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Route</h2>
        <MapContainer center={trip.originCoords} zoom={6} scrollWheelZoom={false} className="w-full h-96 rounded-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={trip.originCoords} icon={startIcon}>
            <Popup>Start: {trip.origin}</Popup>
          </Marker>
          <Marker position={trip.destinationCoords} icon={endIcon}>
            <Popup>Destination: {trip.destination}</Popup>
          </Marker>
          <Polyline positions={[trip.originCoords, trip.destinationCoords]} color="blue" />
        </MapContainer>
      </div>

      {/* Trip Details Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Origin:</strong> {trip.origin}</p>
          <p><strong>Destination:</strong> {trip.destination}</p>
          <p><strong>Pickup Point:</strong> {trip.pickupPoint}</p>
          <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {trip.time}</p>
          <p><strong>Vehicle:</strong> {trip.vehicle}</p>
          <p><strong>Price Per Seat:</strong> ${trip.pricePerSeat}</p>
          <p><strong>Seats Available:</strong> {trip.seatsAvailable}</p>
          <p><strong>Description:</strong> {trip.description}</p>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Passengers</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((u) => (
              <div key={u._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
                <img src={`${url}/${u.profileImage}`} alt={u.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${u.host ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}>
                    {u.host ? "Host" : "Passenger"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No passengers found.</p>
        )}
      </div>

      {/* Cancel/Leave Trip Button */}
      <div className="mt-6 text-center">
        {isHost ? (
          <button onClick={handleCancelTrip} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
            Cancel Trip
          </button>
        ) : (
          <button onClick={handleLeaveTrip} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
            Leave Trip
          </button>
        )}
      </div>
    </div>
  );
}

export default TripMap;
