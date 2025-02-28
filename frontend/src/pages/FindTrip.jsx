import React, { useState } from 'react';
import Usercard from '../component/Usercard/Usercard.jsx';

function FindTrip() {
  const trips = [
    {
      userName: "John Doe",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
      origin: "New York",
      destination: "Boston",
      date: "2025-03-10",
      time: "10:00 AM",
      seatsAvailable: 3,
      pricePerSeat: "$50",
      vehicle: "Toyota Prius",
      pickupPoint: "Central Park",
      mobileNumber: "+1234567890",
      email: "user1@example.com",
      description: "Comfortable ride with AC and music.",
      join_person: {
        count: 2,
        names: ["Alice", "Bob"]
      }
    },
    {
      userName: "Emily Smith",
      userImage: "https://randomuser.me/api/portraits/women/45.jpg",
      origin: "Los Angeles",
      destination: "San Francisco",
      date: "2025-03-12",
      time: "2:00 PM",
      seatsAvailable: 2,
      pricePerSeat: "$75",
      vehicle: "Honda Civic",
      pickupPoint: "LAX Airport",
      mobileNumber: "+1987654321",
      email: "user2@example.com",
      description: "Friendly driver with a spacious car.",
      join_person: {
        count: 1,
        names: ["Charlie"]
      }
    },
    {
      userName: "Michael Brown",
      userImage: "https://randomuser.me/api/portraits/men/55.jpg",
      origin: "Chicago",
      destination: "Detroit",
      date: "2025-03-15",
      time: "5:30 PM",
      seatsAvailable: 4,
      pricePerSeat: "$40",
      vehicle: "Ford Explorer",
      pickupPoint: "Downtown Station",
      mobileNumber: "+1122334455",
      email: "user3@example.com",
      description: "Great conversation and free snacks!",
      join_person: {
        count: 3,
        names: ["Dave", "Eve", "Frank"]
      }
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(trip =>
    trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
          Find a Trip
        </h1>
        <p className="text-base sm:text-lg text-center text-gray-600 mb-6 sm:mb-10">
          Browse available trips and connect with fellow travelers for a comfortable journey.
        </p>

        {/* Search Input */}
        <div className="mb-6 sm:mb-10">
          <input
            type="text"
            placeholder="Search by origin or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Trip List */}
        <div className="flex flex-col space-y-6 sm:space-y-8">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Usercard trip={trip} key={trip.email} />
            ))
          ) : (
            <p className="text-center text-gray-600">No trips found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindTrip;
