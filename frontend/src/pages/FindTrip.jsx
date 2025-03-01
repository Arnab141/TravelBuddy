import React, { useState, useEffect } from 'react';
import Usercard from '../component/Usercard/Usercard.jsx';
import { useAppContext } from '../component/AllContext/AllContext.jsx';

function FindTrip() {
  const { url } = useAppContext();
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${url}/api/trips/all-trips`);
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        console.log('Fetched Trips:', data); // Debugging: Check response structure
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError(error.message);
      }
    };

    fetchTrips();
  }, []);

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
          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Usercard key={trip._id} trip={trip} />
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
