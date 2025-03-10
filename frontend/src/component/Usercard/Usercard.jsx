import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import './Usercard.css';
import user_icon from '../../assets/client_image/user_icon.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Usercard({ trip: initialTrip }) {
  const { token, url, user, getUserInformation } = useAppContext();
  const [trip, setTrip] = useState(initialTrip);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoin = async () => {
    try {
      const response = await fetch(`${url}/api/trips/join-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tripId: trip._id, userId: user._id }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Successfully joined the trip 🎉');
        setTrip(prevTrip => ({
          ...prevTrip,
          participants: [...prevTrip.participants, { userId: user._id, joinedAt: new Date() }],
          seatsAvailable: prevTrip.seatsAvailable - 1,
        }));
      } else {
        toast.error(result.msg || 'Failed to join the trip.');
      }
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    getUserInformation();
  }, [token]);

  return (
    <div>
      {/* Trip Card */}
      <div className="bg-white shadow-md rounded-lg p-5 transition transform hover:scale-105 hover:shadow-lg" onClick={() => setIsModalOpen(true)}>
        <div className="flex items-center space-x-4">
          <img
            src={trip.userId.profileImage ? `${url}/${trip.userId.profileImage}` : user_icon}
            alt="User"
            className="w-16 h-16 rounded-full border-2 border-blue-300"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{trip.userId.name || 'Unknown User'}</h3>
            <p className="text-sm text-gray-600"><strong>From:</strong> {trip.origin} → <strong>To:</strong> {trip.destination}</p>
            <p className="text-sm text-gray-600"><strong>Seats:</strong> {trip.seatsAvailable} | <strong>Price:</strong> ₹{trip.pricePerSeat}</p>
          </div>
        </div>
      </div>

      {/* Centered Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-[99999]">
          <div className="bg-white w-[450px] p-6 rounded-xl shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Trip Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Host Name:</strong> {trip.userId.name}</p>
              <p><strong>Origin:</strong> {trip.origin}</p>
              <p><strong>Destination:</strong> {trip.destination}</p>
              <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {trip.time}</p>
              <p><strong>Seats Available:</strong> {trip.seatsAvailable}</p>
              <p><strong>Price Per Seat:</strong> ₹{trip.pricePerSeat}</p>
              <p><strong>Vehicle:</strong> {trip.vehicle}</p>
              <p><strong>Pickup Point:</strong> {trip.pickupPoint}</p>
              <p><strong>Description:</strong> {trip.description}</p>
            </div>
            <div className="mt-4 space-y-1 text-gray-800">
              <p><strong>Phone:</strong> <a href={`tel:${trip.mobileNumber}`} className="text-blue-500">{trip.mobileNumber}</a></p>
              <p><strong>Email:</strong> <a href={`mailto:${trip.email}`} className="text-blue-500">{trip.email}</a></p>
            </div>
            <div className="mt-3 text-gray-700">
              <strong>Participants:</strong>
              {trip.participants.length > 0 ? (
                trip.participants.map((participant, index) => (
                  <span key={participant.userId._id}> {participant.userId.name}{index !== trip.participants.length - 1 ? ', ' : ''}</span>
                ))
              ) : (
                <span> No one has joined yet.</span>
              )}
            </div>
            <div className="flex justify-between mt-5">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">Chat</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition" onClick={handleJoin}>Join Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usercard;
