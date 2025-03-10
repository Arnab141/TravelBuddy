import React, { useEffect, useState } from "react";
import TripMap from "../component/TripMap/TripMap";
import { useAppContext } from "../component/AllContext/AllContext";

function MyTrip() {
  const { url, token, getUserInformation } = useAppContext();
  const [allTripData, setAllTripData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserTrip = async () => {
    setLoading(true);
    setError(null);
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
      setAllTripData(data.trips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTrip();
    getUserInformation();
  }, [url, token]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6A11CB] via-[#2575FC] to-[#009FFF] p-6"
    >
      <div className="max-w-6xl w-full bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">My Trips</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Fetching your trips...</p>

            {/* Skeleton UI for trip cards */}
            <div className="mt-6 w-full space-y-4">
              {[1, 2].map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-300 p-4 rounded-lg shadow-lg">
                  <div className="h-6 bg-gray-400 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg font-semibold">
            ⚠️ Error: {error}
          </div>
        ) : allTripData.length > 0 ? (
          <div className="space-y-6">
            {allTripData.map((trip, index) => (
              <div
                key={index}
                className="p-6 bg-white bg-opacity-90 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-lg"
              >
                <TripMap TripData={trip} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl font-semibold text-gray-600">No trips found.</p>
        )}
      </div>
    </div>
  );
}

export default MyTrip;
