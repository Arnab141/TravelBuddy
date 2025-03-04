import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './TripMap.css';

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const  trip={
    origin: 'San Francisco, CA',
    destination: 'Los Angeles, CA',
    originCoords: [37.7749, -122.4194],
    destinationCoords: [34.0522, -118.2437],
    date: '2021-06-01',
    time: '08:00',
    vehicle: 'Toyota Camry',
    pricePerSeat: 50,
    seatsAvailable: 3,
    description: 'Ride in comfort with leather seats and AC'
} 

function TripMap() {
  const { origin, destination, originCoords, destinationCoords, date, time, vehicle, pricePerSeat, seatsAvailable, description } = trip;

  if (!originCoords || !destinationCoords) {
    return <p>Loading map...</p>;
  }

  return (
    <div className="trip-map-container">
      <MapContainer center={originCoords} zoom={13} scrollWheelZoom={false} className="trip-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={originCoords} icon={startIcon}>
          <Popup>
            Start: {origin}
          </Popup>
        </Marker>
        <Marker position={destinationCoords} icon={endIcon}>
          <Popup>
            Destination: {destination}
          </Popup>
        </Marker>
        <Polyline positions={[originCoords, destinationCoords]} color="blue" />
      </MapContainer>
      <div className="trip-details">
        <h2>Trip Details</h2>
        <p><strong>Origin:</strong> {origin}</p>
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Vehicle:</strong> {vehicle}</p>
        <p><strong>Price Per Seat:</strong> ${pricePerSeat}</p>
        <p><strong>Seats Available:</strong> {seatsAvailable}</p>
        <p><strong>Description:</strong> {description}</p>
      </div>
    </div>
  );
}

export default TripMap;
