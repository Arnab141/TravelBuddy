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
    <div className="max-w-6xl mx-auto p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Fetching your trips...</p>

          {/* Skeleton UI for trip cards */}
          <div className="mt-6 w-full space-y-4">
            {[1, 2].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-100 p-4 rounded-lg shadow-lg">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg font-semibold">
          ⚠️ Error: {error}
        </div>
      ) : allTripData.length > 0 ? (
        allTripData.map((trip, index) => <TripMap key={index} TripData={trip} />)
      ) : (
        <p className="text-center text-xl font-semibold text-gray-600">No trips found.</p>
      )}
    </div>
  );
}

export default MyTrip;
