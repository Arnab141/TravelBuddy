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
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError(error.message);
      }
    };

    fetchTrips();
  }, [url]);

  // console.log(trips);

  const filteredTrips = trips.filter(trip =>
    trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
          Find a Trip
        </h1>
        <p className="text-base sm:text-lg text-center text-gray-600 mb-6 sm:mb-10">
          Browse available trips and connect with fellow travelers for a comfortable journey.
        </p>

        {/* Search Input */}
        <div className="mb-6 sm:mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Search by origin or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg p-3 sm:p-4 border border-gray-300 rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Trip List */}
        <div className="flex flex-wrap justify-center gap-6">
          {error ? (
            <div className="error-message w-full text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <div key={trip._id} className="bg-white shadow-lg rounded-xl p-6 w-full sm:w-96 md:w-80 lg:w-72 transition transform hover:scale-105 hover:shadow-2xl border border-gray-200">
                <Usercard trip={trip} />
              </div>

            ))
          ) : (
            <div className="no-trips-message w-full text-center">
              <p className="text-gray-600">No trips found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindTrip;
